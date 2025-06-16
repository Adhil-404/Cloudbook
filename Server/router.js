const express = require('express')
const Router = express.Router()

const usercontroller = require("./Controllers/UserController")
Router.post("/userreg", usercontroller.UserRegistration , usercontroller.login)
module.exports = Router