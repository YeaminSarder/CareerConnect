import mongoose from 'mongoose'

const Schema = mongoose.Schema

const connectionSchema = new Schema(
	{
		requester: {
			type: Schema.Types.ObjectId,
			ref: 'user',
			required: true
		},
		recipient: {
			type: Schema.Types.ObjectId,
			ref: 'user',
			required: true
		},
		status: {
			type: String,
			enum: ['Pending', 'Accepted', 'Rejected', 'Removed'],
			default: 'Pending'
		}
	},
	{ timestamps: true }
)

export default mongoose.model('connection', connectionSchema)
