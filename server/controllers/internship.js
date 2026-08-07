import Internship from '../models/internship.js'

// GET /api/internships (supports multi-filtering for FR-18)
// GET /api/internships (supports multi-filtering for FR-18)
export const searchAndFilterInternships = async (req, res) => {
	try {
		const { search, company, location, workMode, skill, status } = req.query
		const filter = {}

		if (search) {
			filter.$or = [
				{ title: { $regex: search, $options: 'i' } },
				{ company: { $regex: search, $options: 'i' } },
				{ description: { $regex: search, $options: 'i' } },
				{ eligibilityCriteria: { $regex: search, $options: 'i' } }
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

		const internships = await Internship.find(filter)
			.populate('postedBy', 'name email role')
			.sort({ createdAt: -1 })
		res.status(200).json(internships)
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

// POST /api/internships (create posting for authorized recruiters or admin users)
export const createInternship = async (req, res) => {
	try {
		// Authorization check: User must be a recruiter or admin
		if (!req.user || (req.user.role !== 'recruiter' && req.user.role !== 'admin')) {
			return res.status(403).json({ error: 'Access denied: Only authorized recruiters or admin users can create internship posts.' })
		}

		const { title, company, location, workMode, requiredSkills, salaryRange, deadline, description, eligibilityCriteria } = req.body

		if (!title || !company || !location) {
			return res.status(400).json({ error: 'Please provide company name, role title, and location.' })
		}

		// Handle skills array parsing if passed as comma-separated string or array
		let skillsArray = []
		if (Array.isArray(requiredSkills)) {
			skillsArray = requiredSkills
		} else if (typeof requiredSkills === 'string' && requiredSkills.trim().length > 0) {
			skillsArray = requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
		}

		const internship = await Internship.create({
			title,
			company,
			location,
			workMode: workMode || 'Onsite',
			requiredSkills: skillsArray,
			salaryRange: salaryRange || 'Negotiable',
			deadline: deadline ? new Date(deadline) : undefined,
			description: description || '',
			eligibilityCriteria: eligibilityCriteria || '',
			postedBy: req.user._id
		})

		const populatedInternship = await Internship.findById(internship._id).populate('postedBy', 'name email role')

		res.status(201).json(populatedInternship)
	} catch (err) {
		res.status(400).json({ error: err.message })
	}
}

// DELETE /api/internships/:id (delete posting for recruiters or admin users)
export const deleteInternship = async (req, res) => {
	try {
		if (!req.user || (req.user.role !== 'recruiter' && req.user.role !== 'admin')) {
			return res.status(403).json({ error: 'Access denied: Only authorized recruiters or admin users can delete internship posts.' })
		}

		const { id } = req.params
		const internship = await Internship.findById(id)

		if (!internship) {
			return res.status(404).json({ error: 'Internship post not found' })
		}

		// Allow delete if admin or owner recruiter
		if (req.user.role === 'admin' || (internship.postedBy && internship.postedBy.toString() === req.user._id.toString()) || req.user.role === 'recruiter') {
			await Internship.findByIdAndDelete(id)
			return res.status(200).json({ message: 'Internship post deleted successfully', _id: id })
		}

		res.status(403).json({ error: 'Not authorized to delete this internship post' })
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

export default {
	searchAndFilterInternships,
	createInternship,
	deleteInternship
}
