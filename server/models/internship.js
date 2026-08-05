import mongoose from 'mongoose'

const Schema = mongoose.Schema

const internshipSchema = new Schema(
	{
		title: {
			type: String,
			required: true
		},
		company: {
			type: String,
			required: true
		},
		location: {
			type: String,
			required: true
		},
		workMode: {
			type: String,
			enum: ['Onsite', 'Remote', 'Hybrid'],
			default: 'Onsite'
		},
		requiredSkills: [String],
		salaryRange: {
			type: String,
			default: 'Negotiable'
		},
		deadline: {
			type: Date
		},
		description: {
			type: String,
			default: ''
		},
		status: {
			type: String,
			enum: ['Open', 'Closed'],
			default: 'Open'
		}
	},
	{ timestamps: true }
)

export default mongoose.model('internship', internshipSchema)
