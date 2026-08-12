import Interview from '../models/interview.js'

// POST /api/interviews
export const createInterview = async (req, res) => {
	try {
		const { company, position, date, meetingLink, mode, notes } = req.body

		if (!company || !position || !date) {
			return res.status(400).json({ error: 'company, position and date are required' })
		}

		const interview = await Interview.create({
			user: req.user._id,
			company,
			position,
			date,
			meetingLink,
			mode,
			notes
		})

		res.status(201).json(interview)
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

// GET /api/interviews
export const getMyInterviews = async (req, res) => {
	try {
		const interviews = await Interview.find({ user: req.user._id }).sort({ date: 1 })
		res.status(200).json(interviews)
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

// PATCH /api/interviews/:id
export const updateInterview = async (req, res) => {
	try {
		const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id })

		if (!interview) {
			return res.status(404).json({ error: 'Interview not found' })
		}

		const { company, position, date, meetingLink, mode, notes, status, postInterviewFeedback } = req.body

		if (company !== undefined) interview.company = company
		if (position !== undefined) interview.position = position
		if (date !== undefined) interview.date = date
		if (meetingLink !== undefined) interview.meetingLink = meetingLink
		if (mode !== undefined) interview.mode = mode
		if (notes !== undefined) interview.notes = notes
		if (status !== undefined) interview.status = status
		if (postInterviewFeedback !== undefined) interview.postInterviewFeedback = postInterviewFeedback

		await interview.save()
		res.status(200).json(interview)
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

// DELETE /api/interviews/:id
export const deleteInterview = async (req, res) => {
	try {
		const interview = await Interview.findOneAndDelete({ _id: req.params.id, user: req.user._id })

		if (!interview) {
			return res.status(404).json({ error: 'Interview not found' })
		}

		res.status(200).json({ message: 'Interview deleted' })
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

// POST /api/interviews/:id/checklist
export const addChecklistItem = async (req, res) => {
	try {
		const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id })

		if (!interview) {
			return res.status(404).json({ error: 'Interview not found' })
		}

		const { task } = req.body
		if (!task) {
			return res.status(400).json({ error: 'task is required' })
		}

		interview.prepChecklist.push({ task })
		await interview.save()

		res.status(200).json(interview)
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

// PATCH /api/interviews/:id/checklist/:itemId
export const toggleChecklistItem = async (req, res) => {
	try {
		const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id })

		if (!interview) {
			return res.status(404).json({ error: 'Interview not found' })
		}

		const item = interview.prepChecklist.id(req.params.itemId)
		if (!item) {
			return res.status(404).json({ error: 'Checklist item not found' })
		}

		item.done = !item.done
		await interview.save()

		res.status(200).json(interview)
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

export default {
	createInterview,
	getMyInterviews,
	updateInterview,
	deleteInterview,
	addChecklistItem,
	toggleChecklistItem
}
