const sendToken = require("../utiles/jwt")
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");
const User = require("../databasemodel/userdb")
const path = require('path');

// Load environment-specific config
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: path.join(__dirname, '..', '..', 'env', envFile) });
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    host: "smtp.gmail.com", 
    port: 587, 
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

exports.register = async (req, res)=>{
    try{
    const { Username, password, confirmPassword, email, PhoneNumber } = req.body;
    if(password!==confirmPassword){
        return res.status(400).json({msg: "Passwords do not match"})
    }
    if (!Username || !email || !PhoneNumber) {
        return res.status(400).json({ message: "Please enter all required fields" });
    }

    // Check if user already exists
    let existingUser = await User.findOne({ $or: [{ email }, { PhoneNumber }] });
    
    if (existingUser) {
        return res.status(400).json({ message: "User with this email or phone number already exists" });
    }

    // Create user directly without OTP
    const user = new User({ 
        Username, 
        password, 
        email, 
        PhoneNumber
    });
    await user.save();

    sendToken(user, 201, res);
    } catch (error) {
        console.error("Registration error:", error.message);
        return res.status(500).json({ 
            success: false, 
            error: "Error in registration",
            message: error.message 
        });
    }
}

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
        return res.status(500).json({ 
            success: false, 
            error: "Error during login",
            message: error.message 
        });
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
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized",
        error: error.message 
      });
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
        return res.status(500).json({
            success: false,
            error:"Error in updating password",
            message: error.message
        });
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
      return res.status(500).json({
          success: false,
          error:"Error in updating username",
          message: error.message
      });
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
      return res.status(500).json({
        success: false,
        error: "Error sending password reset email",
        message: error.message
      });
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
          return res.status(500).json({
              success: false,
              error: "Error resetting password",
              message: error.message
          });
      }
  };
  