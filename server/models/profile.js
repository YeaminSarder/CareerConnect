const mongoose = require('mongoose')

const Schema = mongoose.Schema

const profileSchema = new Schema(
	{
		description: {
			type: String,
			required: false
		},
	},
	{ timestamps: true}
)

module.exports = mongoose.model('profile', profileSchema)
