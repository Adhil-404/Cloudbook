const express = require("express")
const dotenv = require("dotenv")
dotenv.config()
const app = express()
app.use(express.json());
const bodyparser = require("body-parser")
app.use(bodyparser.json())
const db = require("./Dbconnection")
const cors=require("cors")

const router = require("./router")
app.use(cors())

app.use("/", router)
// app.use(express.static(`${__dirname}/upload`));


app.listen(5000, function () {
    console.log("Server successfully working at port 5000");

})  