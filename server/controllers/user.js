const User = require('../models/user')

const loginUser = (req, res) => {
    // Implement login logic here
    res.status(200).json({ message: "Login successful" });
}

const registerUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.register(email, password);
        res.status(201).json({ email, user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = {
    loginUser,
    registerUser
}