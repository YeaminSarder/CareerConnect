import mongoose from 'mongoose'

const Schema = mongoose.Schema

const profileSchema = new Schema(
	{
		description: {
			type: String,
			default: ''
		},
		department: {
			type: String,
			default: ''
		},
		skills: {
			type: [String],
			default: []
		},
		careerInterests: {
			type: [String],
			default: []
		},
		education: [
			{
				institution: String,
				degree: String,
				fieldOfStudy: String,
				startYear: String,
				endYear: String
			}
		],
		experience: [
			{
				title: String,
				company: String,
				location: String,
				startDate: String,
				endDate: String,
				description: String
			}
		],
		projects: [
			{
				title: { type: String, required: true },
				description: { type: String, default: '' },
				projectType: {
					type: String,
					enum: ['Academic Project', 'Thesis Work', 'Personal Project', 'Capstone Project', 'Other'],
					default: 'Academic Project'
				},
				githubLink: { type: String, default: '' },
				liveLink: { type: String, default: '' },
				toolsUsed: { type: [String], default: [] },
				imageUrl: { type: String, default: '' },
				featured: { type: Boolean, default: false }
			}
		]
	},
	{ timestamps: true }
)

// FR-2: Method to calculate profile completion percentage and missing fields
profileSchema.methods.getCompletionScore = function () {
	let score = 0
	const missingFields = []

	if (this.description && this.description.trim().length > 0) {
		score += 15
	} else {
		missingFields.push('Bio / Description')
	}

	if (this.department && this.department.trim().length > 0) {
		score += 10
	} else {
		missingFields.push('Department')
	}

	if (Array.isArray(this.skills) && this.skills.length > 0) {
		score += 20
	} else {
		missingFields.push('Skills')
	}

	if (Array.isArray(this.careerInterests) && this.careerInterests.length > 0) {
		score += 15
	} else {
		missingFields.push('Career Interests')
	}

	if (Array.isArray(this.education) && this.education.length > 0) {
		score += 20
	} else {
		missingFields.push('Education')
	}

	if (Array.isArray(this.experience) && this.experience.length > 0) {
		score += 10
	} else {
		missingFields.push('Experience')
	}

	if (Array.isArray(this.projects) && this.projects.length > 0) {
		score += 10
	} else {
		missingFields.push('Projects')
	}

	return {
		completionPercentage: Math.min(score, 100),
		missingFields
	}
}

export default mongoose.model('profile', profileSchema)

