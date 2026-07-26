import mongoose from 'mongoose'

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

export default mongoose.model('profile', profileSchema)
