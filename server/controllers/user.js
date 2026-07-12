const User = require('../models/user')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}

const loginUser = (req, res) => {
    // Implement login logic here
    res.status(200).json({ message: "Login successful" });
}

const registerUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.register(email, password);
        const token = createToken(user._id);
        res.status(201).json({ email, token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = {
    loginUser,
    registerUser
}