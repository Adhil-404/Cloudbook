const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const bodyparser = require("body-parser");

dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyparser.json());
app.use(cors());

const db = require("./Dbconnection");

app.use("/uploads", express.static(path.join(__dirname, "Uploads"))); 

const bookroutes = require("./Routes/BookRoutes");
app.use("/api", bookroutes);

const router=require('./router')
app.use("/user",router)

const orderRoutes = require('./Routes/OrderRoutes');
app.use('/orders', orderRoutes);

app.listen(5000, function () {
  console.log("Server successfully working at port 5000");
});
