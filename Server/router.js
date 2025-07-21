const express = require('express')
const Router = express.Router()

const OrderController=require("./Controllers/OrderController")
const usercontroller = require("./Controllers/UserController")
Router.post("/user_reg", usercontroller.UserRegistration)
Router.post("/userlogin", usercontroller.login);
Router.post("/place",OrderController.placeOrder)


module.exports = Router 