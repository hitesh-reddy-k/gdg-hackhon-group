const express = require('express');
const router = express.Router();
const path = require('path');
const {register,login,isAuthenticatedUser,updateUsername,updatePassword,forgotPassword,resetPassword} = require("../controller/usercontroller")
const User = require("../databasemodel/userdb")


router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'forentend', 'login-register', 'log.html'));
});

router.get('/sign-up', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'forentend', 'login-register','register.html'));
});

router.get('/home',(req,res)=>{
    res.sendFile(path.join(__dirname, '..', '..', 'forentend','home','home.html'));
})




router.post('/sign-up', register);
router.post('/login', login);
router.put('/updateUsername',isAuthenticatedUser,updateUsername)
router.put('/updatepassword',isAuthenticatedUser,updatePassword)
router.post("/forgotpassword", forgotPassword);
router.post('/reset-password/:id/:token', resetPassword);



module.exports = router;