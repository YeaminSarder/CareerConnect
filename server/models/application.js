import mongoose from 'mongoose'
import { calculateMatchingScore } from '../sevices/application-matching-score.js'

const Schema = mongoose.Schema

const applicationSchema = new Schema(
	{
		student: {
			type: Schema.Types.ObjectId,
			ref: 'user',
			required: true
		},
		internship: {
			type: Schema.Types.ObjectId,
			ref: 'internship',
			required: true
		},
		cv: {
			type: Schema.Types.ObjectId,
			ref: 'cv',
			required: true
		},
		status: {
			type: String,
			enum: ['Applied', 'Under Review', 'Shortlisted', 'Interviewing', 'Accepted', 'Rejected'],
			default: 'Applied'
		},
		appliedAt: {
			type: Date,
			default: Date.now
		}
	},
	{ timestamps: true }
)
applicationSchema.virtual('matchingScore').get(function () {
	// Implementation for matching score calculation
	return calculateMatchingScore(this.student.profile, this.internship, this.cv)
})
// Ensure a student cannot apply twice to the same internship
applicationSchema.index({ student: 1, internship: 1 }, { unique: true })

export default mongoose.model('application', applicationSchema)
