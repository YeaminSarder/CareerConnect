import mongoose from 'mongoose'

const Schema = mongoose.Schema

const endorsementSchema = new Schema(
	{
		fromUser: {
			type: Schema.Types.ObjectId,
			ref: 'user',
			required: true
		},
		toUser: {
			type: Schema.Types.ObjectId,
			ref: 'user',
			required: true
		},
		skill: {
			type: String,
			required: true
		}
	},
	{ timestamps: true }
)

// stops the same person endorsing the same skill on the same user twice
endorsementSchema.index({ fromUser: 1, toUser: 1, skill: 1 }, { unique: true })

export default mongoose.model('endorsement', endorsementSchema)
