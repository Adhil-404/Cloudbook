const express = require("express");
const router = express.Router();

const OtpController = require("../Controllers/Otpcontroller");


router.post("/forgot-password", OtpController.forgotPassword);

router.post("/reset-password", OtpController.resetPassword);

module.exports = router;
