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
		keywords: [String],
		interests: [String],
		department: {
			type: [String],
			default: []
		},
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
		eligibilityCriteria: {
			type: String,
			default: ''
		},
		postedBy: {
			type: Schema.Types.ObjectId,
			ref: 'user'
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
