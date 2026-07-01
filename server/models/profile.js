const mongoose = require('mongoose')

const Schema = mongoose.Schema

const profileSchema = new Schema(
	{
		name: {
			type: String,
			required: true
		},
		age: {
			type: Number,
			required: true
		}
	},
	{ timestamps: true}
)

module.exports = mongoose.model('profile', profileSchema)
