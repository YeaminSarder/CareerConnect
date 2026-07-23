const mongoose = require('mongoose')

const Schema = mongoose.Schema

const bcrypt = require('bcrypt')

const validator = require('validator')

const Profile = require('./profile')

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
		},
        name: {
			type: String,
			required: true
		},
		profile: {
			type: Schema.Types.ObjectId,
			ref: 'profile',
			required: true,
		}
	}
)

userSchema.statics.register = async function(email, password, name) {
	if (!email || !password || !name) {
		throw new Error('All fields must be filled')
	}
	if (!validator.isEmail(email)) {
		throw new Error('Email is not valid')
	}
	if (!validator.isStrongPassword(password)) {
		throw new Error('Password not strong enough')
	}
	const existingUser = await this.findOne({ email })
	if (existingUser) {
		throw new Error('Email already in use')
	}
	const salt = await bcrypt.genSalt()
	const hashedPassword = await bcrypt.hash(password, salt)
	const profile = await Profile.create({ description: '' })
	const user = await this.create({ email, password: hashedPassword, name, profile: profile._id })
	return user
}

userSchema.statics.login = async function(email, password) {
	if (!email || !password) {
		throw new Error('All fields must be filled')
	}
	const user = await this.findOne({ email })
	if (!user) {
		throw new Error('Incorrect email')
	}
	const match = await bcrypt.compare(password, user.password)
	if (!match) {
		throw new Error('Incorrect password')
	}
	return user
}

module.exports = mongoose.model('user', userSchema)
