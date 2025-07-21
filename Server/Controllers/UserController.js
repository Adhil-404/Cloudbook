const UserController = require('../Schema/UserSchema')
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")


const UserRegistration = async (req, res) => {
  try {
    const { fullName, email, phone, dob, gender, password } = req.body;

    if (!fullName || !email || !phone || !dob || !gender || !password) {
      return res.json({ msg: "All fields are required", status: 400 });
    }

    const existingUser = await UserController.findOne({ userEmail: email });

    if (existingUser) {
      return res.json({ msg: "Email already exists", status: 409 });
    }

    const hash = bcrypt.hashSync(password, 10);

    const user = new UserController({
      userName: fullName,
      userEmail: email,
      contact: phone,
      dob: dob,
      gender: gender,
      password: hash
    });

    const result = await user.save();

    console.log("User registered:", result);

    return res.json({
      msg: "Registered Successfully",
      status: 200,
      data: result
    });

  } catch (err) {
    console.error("Registration error:", err);
    return res.json({
      msg: "Registration failed due to server error",
      status: 500
    });
  }
};




const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ err: "Missing email or password" });
    }

    try {
        const result = await UserController.findOne({ userEmail: email });
        if (!result) {
            return res.status(401).json({ err: "Email is wrong" });
        }

        const isMatching = await bcrypt.compare(password, result.password);
        if (!isMatching) {
            return res.status(401).json({ err: "Password is wrong" });
        }

        const token = jwt.sign(
            { _id: result._id, userEmail: result.userEmail },
            process.env.JWT_KEY

        );

        return res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ err: "Internal server error" });
    }
};







module.exports = { UserRegistration, login }