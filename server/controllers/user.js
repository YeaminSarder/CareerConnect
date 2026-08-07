import User from '../models/user.js'
import jwt from 'jsonwebtoken'

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}

const loginUser = async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.status(200).json({ name: user.name, email: user.email, role: user.role || 'student', token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const registerUser = async (req, res) => {
    const { email, password, name, role } = req.body;
    try {
        const user = await User.register(email, password, name, role);
        const token = createToken(user._id);
        res.status(201).json({ name: user.name, email: user.email, role: user.role || 'student', token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export default {
    loginUser,
    registerUser
}