const express = require('express')
const Router = express.Router()

const usercontroller = require("./Controllers/UserController")
Router.post("/userreg", usercontroller.UserRegistration)
Router.post("/userlogin", usercontroller.login);
module.exports = Router