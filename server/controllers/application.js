import Application from '../models/application.js'
import Internship from '../models/internship.js'
import Cv from '../models/cv.js'
import mongoose from 'mongoose'

// POST /api/applications - One-Click Internship Application with Selected CV
export const applyForInternship = async (req, res) => {
	try {
		const { internshipId, cvId } = req.body
		const studentId = req.user._id

		if (!internshipId || !cvId) {
			return res.status(400).json({ error: 'Internship ID and CV ID are required' })
		}

		if (!mongoose.Types.ObjectId.isValid(internshipId) || !mongoose.Types.ObjectId.isValid(cvId)) {
			return res.status(400).json({ error: 'Invalid Internship ID or CV ID' })
		}

		// Verify internship exists
		const internship = await Internship.findById(internshipId)
		if (!internship) {
			return res.status(404).json({ error: 'Internship listing not found' })
		}

		// Verify CV exists and belongs to the user
		const cv = await Cv.findById(cvId)
		if (!cv) {
			return res.status(404).json({ error: 'Selected CV version not found' })
		}
		if (cv.user.toString() !== studentId.toString()) {
			return res.status(403).json({ error: 'Unauthorized: CV does not belong to you' })
		}

		// Check if already applied
		const existingApp = await Application.findOne({ student: studentId, internship: internshipId })
		if (existingApp) {
			return res.status(400).json({ error: 'You have already applied for this internship' })
		}

		const application = await Application.create({
			student: studentId,
			internship: internshipId,
			cv: cvId,
			status: 'Applied'
		})

		const populatedApp = await Application.findById(application._id)
			.populate('internship')
			.populate('cv', 'title')
			.populate('student', 'name email')

		res.status(201).json(populatedApp)
	} catch (err) {
		if (err.code === 11000) {
			return res.status(400).json({ error: 'You have already applied for this internship' })
		}
		res.status(500).json({ error: err.message })
	}
}

// GET /api/applications/my - Personal Application Tracker
export const getMyApplications = async (req, res) => {
	try {
		const studentId = req.user._id
		const applications = await Application.find({ student: studentId })
			.populate('internship')
			.populate('cv', 'title')
			.sort({ createdAt: -1 })

		res.status(200).json(applications)
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

// PATCH /api/applications/:id/status - Update application status (recruiter/admin)
export const updateApplicationStatus = async (req, res) => {
	try {
		const { id } = req.params
		const { status } = req.body

		const validStatuses = ['Applied', 'Under Review', 'Interviewing', 'Accepted', 'Rejected']
		if (!validStatuses.includes(status)) {
			return res.status(400).json({ error: 'Invalid application status' })
		}

		const application = await Application.findByIdAndUpdate(
			id,
			{ status },
			{ new: true }
		).populate('internship').populate('cv', 'title').populate('student', 'name email')

		if (!application) {
			return res.status(404).json({ error: 'Application record not found' })
		}

		res.status(200).json(application)
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

// DELETE /api/applications/:id - Withdraw application (student)
export const withdrawApplication = async (req, res) => {
	try {
		const { id } = req.params
		const studentId = req.user._id

		const application = await Application.findById(id)
		if (!application) {
			return res.status(404).json({ error: 'Application record not found' })
		}

		if (application.student.toString() !== studentId.toString() && req.user.role !== 'admin') {
			return res.status(403).json({ error: 'Unauthorized: Cannot withdraw this application' })
		}

		await Application.findByIdAndDelete(id)
		res.status(200).json({ message: 'Application withdrawn successfully', _id: id })
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

export default {
	applyForInternship,
	getMyApplications,
	updateApplicationStatus,
	withdrawApplication
}

