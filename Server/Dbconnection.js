const mongoose=require("mongoose")
mongoose.connect("mongodb+srv://nehadevu36:nehadevu2002@cluster0.5nem7l0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
var db=mongoose.connection
db.on("error",console.error.bind("error"))
db.once("open",function(){
    console.log("connection successful")
})

module.exports=db