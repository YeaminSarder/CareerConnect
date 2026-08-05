import Internship from '../models/internship.js'

// GET /api/internships (supports multi-filtering for FR-18)
export const searchAndFilterInternships = async (req, res) => {
	try {
		const { search, company, location, workMode, skill, status } = req.query
		const filter = {}

		if (search) {
			filter.$or = [
				{ title: { $regex: search, $options: 'i' } },
				{ company: { $regex: search, $options: 'i' } },
				{ description: { $regex: search, $options: 'i' } }
			]
		}

		if (company) {
			filter.company = { $regex: company, $options: 'i' }
		}

		if (location) {
			filter.location = { $regex: location, $options: 'i' }
		}

		if (workMode && ['Onsite', 'Remote', 'Hybrid'].includes(workMode)) {
			filter.workMode = workMode
		}

		if (skill) {
			filter.requiredSkills = { $in: [new RegExp(skill, 'i')] }
		}

		if (status) {
			filter.status = status
		}

		const internships = await Internship.find(filter).sort({ createdAt: -1 })
		res.status(200).json(internships)
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

// POST /api/internships (create posting for testing/admin)
export const createInternship = async (req, res) => {
	try {
		const { title, company, location, workMode, requiredSkills, salaryRange, deadline, description } = req.body

		const internship = await Internship.create({
			title,
			company,
			location,
			workMode,
			requiredSkills: requiredSkills || [],
			salaryRange: salaryRange || 'Negotiable',
			deadline: deadline ? new Date(deadline) : undefined,
			description: description || ''
		})

		res.status(201).json(internship)
	} catch (err) {
		res.status(400).json({ error: err.message })
	}
}

export default {
	searchAndFilterInternships,
	createInternship
}
