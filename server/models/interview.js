import mongoose from 'mongoose'

const Schema = mongoose.Schema

const interviewSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'user',
			required: true
		},
		company: {
			type: String,
			required: true
		},
		position: {
			type: String,
			required: true
		},
		date: {
			type: Date,
			required: true
		},
		meetingLink: {
			type: String,
			default: ''
		},
		mode: {
			type: String,
			enum: ['Online', 'In-Person'],
			default: 'Online'
		},
		status: {
			type: String,
			enum: ['Scheduled', 'Completed', 'Cancelled'],
			default: 'Scheduled'
		},
		notes: {
			type: String,
			default: ''
		},
		prepChecklist: [
			{
				task: { type: String, required: true },
				done: { type: Boolean, default: false }
			}
		],
		postInterviewFeedback: {
			type: String,
			default: ''
		}
	},
	{ timestamps: true }
)

export default mongoose.model('interview', interviewSchema)
