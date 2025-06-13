const UserLoginCon = require('../Schema/UserSchema');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ err: "Missing email or password" });
    }

    try {
        const result = await UserLoginCon.findOne({ userEmail: email });
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

module.exports = { login };
