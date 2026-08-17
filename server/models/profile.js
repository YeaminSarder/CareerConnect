import mongoose from 'mongoose'

const Schema = mongoose.Schema

const profileSchema = new Schema(
	{
		// Basic Profile Information
		photo: { type: String, default: '' },
		bio: { type: String, default: '' },
		contactPhone: { type: String, default: '' },
		contactEmail: { type: String, default: '' },
		location: { type: String, default: '' },
		department: { type: String, default: '' },
		university: { type: String, default: 'BRAC University' },

		// Education History
		education: [
			{
				university: { type: String, required: true },
				degree: { type: String, required: true },
				major: { type: String, default: '' },
				cgpa: { type: String, default: '' },
				startYear: { type: String, default: '' },
				endYear: { type: String, default: '' }
			}
		],

		// Categorized Skills Management
		skills: [
			{
				name: { type: String, required: true },
				category: { type: String, default: 'Technical' } // Programming, Soft Skills, Leadership, Frameworks, etc.
			}
		],

		// Experience Section (Internships, Part-Time, Volunteer, Leadership)
		experience: [
			{
				title: { type: String, required: true },
				companyOrOrg: { type: String, required: true },
				type: { type: String, default: 'Internship' }, // Internship, Part-Time, Volunteer, Leadership
				startDate: { type: String, default: '' },
				endDate: { type: String, default: '' },
				description: { type: String, default: '' }
			}
		],

		// Project Portfolio
		projects: [
			{
				title: { type: String, required: true },
				description: { type: String, default: '' },
				technologies: [String],
				githubLink: { type: String, default: '' },
				demoLink: { type: String, default: '' },
				startDate: { type: String, default: '' },
				endDate: { type: String, default: '' }
			}
		],

		// Certifications
		certifications: [
			{
				name: { type: String, required: true },
				issuingOrganization: { type: String, required: true },
				issueDate: { type: String, default: '' },
				expiryDate: { type: String, default: '' },
				credentialLink: { type: String, default: '' }
			}
		],

		// Career Interests
		careerInterests: {
			jobRoles: [String],
			industries: [String],
			workModes: [String], // Onsite, Remote, Hybrid
			careerFields: [String]
		},

		// Profile Visibility Control
		visibility: {
			basic: { type: String, default: 'Public' }, // Public, Connections Only, Private
			education: { type: String, default: 'Public' },
			experience: { type: String, default: 'Public' },
			projects: { type: String, default: 'Public' },
			certifications: { type: String, default: 'Public' }
		},

		// Profile Update Tracking
		lastModifiedSection: { type: String, default: 'Basic Information' },
		lastUpdated: { type: Date, default: Date.now }
	},
	{ timestamps: true }
)

// Expanded Profile Completion Score Algorithm (100% Weighted Breakdown)
profileSchema.methods.getCompletionScore = function () {
	let score = 0
	const breakdown = []
	const suggestions = []

	// 1. Basic Information (15%)
	const hasBasic = (this.bio && this.bio.trim().length > 0) || (this.department && this.department.trim().length > 0) || (this.location && this.location.trim().length > 0)
	if (hasBasic) {
		score += 15
		breakdown.push({ section: 'Basic Information', weight: 15, earned: 15, complete: true })
	} else {
		breakdown.push({ section: 'Basic Information', weight: 15, earned: 0, complete: false })
		suggestions.push('Add basic profile details (bio, department, location) to earn +15%.')
	}

	// 2. Education History (15%)
	if (Array.isArray(this.education) && this.education.length > 0) {
		score += 15
		breakdown.push({ section: 'Education History', weight: 15, earned: 15, complete: true })
	} else {
		breakdown.push({ section: 'Education History', weight: 15, earned: 0, complete: false })
		suggestions.push('Add at least one education record (degree, university) to earn +15%.')
	}

	// 3. Skills Management (15%)
	if (Array.isArray(this.skills) && this.skills.length > 0) {
		score += 15
		breakdown.push({ section: 'Skills Management', weight: 15, earned: 15, complete: true })
	} else {
		breakdown.push({ section: 'Skills Management', weight: 15, earned: 0, complete: false })
		suggestions.push('Add at least one key technical or soft skill to earn +15%.')
	}

	// 4. Experience Section (15%)
	if (Array.isArray(this.experience) && this.experience.length > 0) {
		score += 15
		breakdown.push({ section: 'Experience', weight: 15, earned: 15, complete: true })
	} else {
		breakdown.push({ section: 'Experience', weight: 15, earned: 0, complete: false })
		suggestions.push('Add an internship, part-time job, or volunteer work experience to earn +15%.')
	}

	// 5. Project Portfolio (20%)
	if (Array.isArray(this.projects) && this.projects.length > 0) {
		score += 20
		breakdown.push({ section: 'Project Portfolio', weight: 20, earned: 20, complete: true })
	} else {
		breakdown.push({ section: 'Project Portfolio', weight: 20, earned: 0, complete: false })
		suggestions.push('Add at least one academic or portfolio project (+20%) to increase your completion score.')
	}

	// 6. Certifications (10%)
	if (Array.isArray(this.certifications) && this.certifications.length > 0) {
		score += 10
		breakdown.push({ section: 'Certifications', weight: 10, earned: 10, complete: true })
	} else {
		breakdown.push({ section: 'Certifications', weight: 10, earned: 0, complete: false })
		suggestions.push('Add a professional certification or online course credential to earn +10%.')
	}

	// 7. Career Interests (10%)
	const ci = this.careerInterests || {}
	const hasInterests = (ci.jobRoles && ci.jobRoles.length > 0) || (ci.industries && ci.industries.length > 0) || (ci.workModes && ci.workModes.length > 0) || (ci.careerFields && ci.careerFields.length > 0)
	if (hasInterests) {
		score += 10
		breakdown.push({ section: 'Career Interests', weight: 10, earned: 10, complete: true })
	} else {
		breakdown.push({ section: 'Career Interests', weight: 10, earned: 0, complete: false })
		suggestions.push('Specify preferred job roles, industries, or work modes to earn +10%.')
	}

	return {
		completionPercentage: Math.min(score, 100),
		breakdown,
		suggestions
	}
}

export default mongoose.model('profile', profileSchema)
