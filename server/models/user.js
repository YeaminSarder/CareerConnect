const mongoose = require('mongoose')

const Schema = mongoose.Schema

const bcrypt = require('bcrypt')

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true
		},
		password: {
			type: String,
			required: true
		}
	}
)

userSchema.statics.register = async function(email, password) {
	const existingUser = await this.findOne({ email })
	if (existingUser) {
		throw new Error('Email already in use')
	}
	const salt = await bcrypt.genSalt()
	const hashedPassword = await bcrypt.hash(password, salt)
	const user = await this.create({ email, password: hashedPassword })
	return user
}

module.exports = mongoose.model('user', userSchema)
