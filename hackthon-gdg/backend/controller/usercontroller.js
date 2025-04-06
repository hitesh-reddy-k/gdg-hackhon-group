const sendToken = require("../utiles/jwt")
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");
const PendingUser = require("../databasemodel/pendinguserdb")
const User = require("../databasemodel/userdb")



dotenv.config({ path: "backend/envfile/config.env" });
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: "smtp.gmail.com", 
    port: 587, 
    secure: false,
    auth: {
        user: "aithings74@gmail.com",
        pass: "bywq rtiv xnkp xisg"
    }
})

const sendOTPEmail = async (toEmail, otp) => {
    try {
        const mailOptions = {
            from: '"Food-Application" <aithings74@gmail.com>',
            to: toEmail,
            subject: 'Your OTP Verification Code',
            text: `Your OTP verification code is ${otp}. It is valid for 10 minutes.`
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error.message);
        throw new Error("Failed to send OTP email");
    }
}

exports.register = async (req, res)=>{
    try{
    const { Username, password, confirmPassword, email, PhoneNumber } = req.body;
    if(password!==confirmPassword){
        return res.status(400).json({msg: "Passwords do not match"})
    }
    if (!Username || !email || !PhoneNumber) {
        return res.status(400).json({ message: "Please enter all required fields" });
    }

    let existingUser = await User.findOne({ $or: [{ email }, { PhoneNumber }] });
        let pendingUser = await PendingUser.findOne({ $or: [{ email }, { PhoneNumber }] });

        if (existingUser || pendingUser) {
            return res.status(400).json({ message: "User with this email or phone number already exists" });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpire = new Date(Date.now() + 10 * 60 * 1000); 


        await sendOTPEmail(email, otp);

        const user = new PendingUser({ 
            Username, 
            password, 
            email, 
            PhoneNumber, 
            otp, 
            otpExpire 
        });
        await user.save();

        res.status(200).json({ message: "OTP sent to your email address" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Error in registration" });
    }
}

exports.verifyOtp = async (req, res) => {
    try {
        console.log("Received data:", req.body);

        // Log all users in PendingUser for debugging
        const allUsers = await PendingUser.find();
        console.log("All pending users:", allUsers);

        const { PhoneNumber, otp } = req.body;

        if (!PhoneNumber || !otp) {
            return res.status(400).json({ message: "Please enter a valid phone number and OTP" });
        }

        const pendingUser = await PendingUser.findOne({ PhoneNumber });

        console.log("Matched user:", pendingUser);

        if (!pendingUser) {
            return res.status(400).json({ message: "Invalid phone number" });
        }

        if (pendingUser.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }


        if (new Date() > pendingUser.otpExpire) {
            return res.status(400).json({ message: "OTP expired" });
        }

        const { Username, password, email } = pendingUser; 
        await PendingUser.deleteOne({ PhoneNumber });

        const user = new User({ 
            Username, 
            password, 
            email, 
            PhoneNumber 
        });
        await user.save();

        sendToken(user, 200, res);
    } catch (error) {
        console.log("Server Error:", error.message);
        res.status(500).json({ error: "Error in verifying OTP" });
    }
};



exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        

        if (!email || !password) {
            return res.status(400).json({ message: "Please enter a valid email and password" });
        }

        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        console.log('Stored hashed password:', user.password);

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        sendToken(user, 200, res);
    } catch (error) {
        console.error("Error during login:", error.message);
        res.status(500).json({ error: "Error during login" });
    }
};


exports.isAuthenticatedUser = async (req, res, next) => {
    try {
      const { token } = req.cookies;
    //   let token;
  
    //   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    //     token = req.headers.authorization.split(' ')[1];
    //   }
      
      if (!token) {
        console.log("Token not found");
        return res.status(401).send("Unauthorized: Token not found");
      }
      
      const decodedData = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decodedData.id);
      
      next();
    } catch (error) {
      console.error("Error in isAuthenticatedUser middleware:", error.message);
      res.status(401).json({ message: "Unauthorized" });
    }                                   
}
  


exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "You are not allowed" });
      }
      next();
    };
}




exports.updatePassword = async(req,res,next)=>{
    try{
        const {password,newPassword}=req.body;
        if(!password ||!newPassword){
            return res.status(400).json({message:"Password and new password are required"});
        }
        const isMatch = await req.user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid password"});
        }
        req.user.password=newPassword;
        await req.user.save();
        res.status(200).json({message:"Password updated successfully"});
    }catch(error){
        console.error("Error in updating password:",error.message);
        res.status(500).json({error:"Error in updating password"});
    }
}

exports.updateUsername = async(req,res,next)=>{
  try{
      const {Username}=req.body;
      if(!Username){
          return res.status(400).json({message:"Username is required"});
      }
      req.user.Username=Username;
      await req.user.save();
      res.status(200).json({message:"Username updated successfully"});
  }catch(error){
      console.error("Error in updating username:",error.message);
      res.status(500).json({error:"Error in updating username"});
  }
}



exports.forgotPassword = async (req, res, next) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          status: "fail",
          message: `User with email ${email} not found`,
        });
      }
  
      const resetToken = user.getResetPasswordToken();
      await user.save({ validateBeforeSave: false });
  
      const resetPasswordUrl = `${req.protocol}://${req.get("host")}/user/reset-password/${user._id}/${resetToken}`;
  
      const message = `Your password reset token is:\n\n${resetPasswordUrl}\n\nIf you have not requested this email, please ignore it.`;
      console.log(message)
      
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE, 
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
  
      const mailOptions = {
        from: '"StreakChat" <hiteshreddyai@gmail.com>', 
        to: user.email, 
        subject: 'Password Reset Request', 
        text: message,
      };
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      User.resetPasswordToken = undefined;
      User.resetPasswordExpire = undefined;
      await User.save({ validateBeforeSave: false })
  
      next(error);
    }
  };
  
  exports.resetPassword = async (req, res, next) => {

      const { id, token } = req.params;
      const { newPassword } = req.body;
  
      console.log('ID:', id);
      console.log('Token:', token);
      console.log('New Password:', newPassword);
      try {
          if (typeof newPassword !== 'string' || newPassword.trim() === '') {
              return res.status(400).json({
                  status: "fail",
                  message: "Invalid password format",
              });
          }
  
          const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
          const user = await User.findOne({
              _id: id,
              resetPasswordToken: hashedToken,
              resetPasswordExpire: { $gt: Date.now() }
        
          });
  
          if (!user) {
              return res.status(400).json({
                  status: "fail",
                  message: "Invalid or expired password reset token",
              });
              
          }
  
          console.log('User before update:', user);
          
  
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(newPassword, salt);
  
          console.log('Hashed password before saving:', hashedPassword);
  
          user.password = hashedPassword;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpire = undefined;
  
          await user.save();
  
          console.log('User after update:', user);


          const isMatch = await bcrypt.compare(newPassword, user.password);
          console.log('Password comparison result after save:', isMatch);
  
          res.status(200).json({
              status: "success",
              message: "Password has been reset successfully",
          });
      } catch (error) {
          console.error('Reset password error:', error);
          console.error("reset password failed :",error);
          next(error);
      }
  };
  