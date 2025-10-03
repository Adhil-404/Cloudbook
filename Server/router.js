const express = require('express');
const Router = express.Router();

const usercontroller = require("./Controllers/UserController");
const router = require('./Routes/BookRoutes');
const profilAuth=require("./Middleware/ProfileAuth")


Router.post("/user_reg", usercontroller.UserRegistration);
Router.post("/userlogin", usercontroller.login);
router.get("/profile",profilAuth,usercontroller.getUserProfile)

module.exports = Router;