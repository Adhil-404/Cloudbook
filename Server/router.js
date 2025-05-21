const express = require('express')
const Router = express.Router()

const usercontroller = require("./Controllers/UserController")
const UserLoginCon = require("./Controllers/UserLoginCon")
Router.post("/userreg", usercontroller.UserRegistration)
Router.post("/userlogin", UserLoginCon.login)


module.exports = Router