const express = require('express');
const path = require('path');
const router = express.Router();
const {generate,confirmPlan,getPlanByUserId,orderex} = require("../controller/userInfoController")


router.get('/dite-input', function (req, res) {
    res.sendFile(path.join(__dirname, '..', '..', 'forentend', 'home', 'user-info.html'));
})

router.get('/order', function (req, res) {
    res.sendFile(path.join(__dirname, '..', '..', 'forentend', 'home', 'order.html'));
})

router.get('/orderx', function (req, res) {
    res.sendFile(path.join(__dirname, '..', '..', 'forentend', 'home', 'order-food.html'));
})





router.post("/generate",generate)
router.post("/confirm-plan",confirmPlan)
router.get("/orderex/:userId", orderex);
router.get("/get-plan/:userId", getPlanByUserId);





module.exports = router;