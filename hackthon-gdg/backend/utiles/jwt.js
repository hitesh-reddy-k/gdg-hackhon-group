const jwt = require('jsonwebtoken');

const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();

    const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), 
        httpOnly: true,  
        secure: false,   
        sameSite: 'Strict' 
    };

    res.status(statusCode)
       .cookie("token", token, options)
       .json({
            success: true,
            user: {
                id: user._id,
                username: user.Username,
                email: user.Email,
                role: user.role
            },
            token,
        });
};

module.exports = sendToken;
