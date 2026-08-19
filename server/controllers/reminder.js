import Internship from '../models/internship.js'
import Interview from '../models/interview.js'
import Application from '../models/application.js'

// GET /api/reminders
// Fetches upcoming internship deadlines, scheduled interviews, and stale applications for the current user
export const getReminders = async (req, res) => {
	try {
		const userId = req.user._id
		const now = new Date()
		const STALE_DAYS = 7
		const staleThreshold = new Date(now.getTime() - STALE_DAYS * 24 * 60 * 60 * 1000)

		// 1. Fetch upcoming internship deadlines
		const internships = await Internship.find({
			status: 'Open',
			deadline: { $exists: true, $ne: null }
		})
			.sort({ deadline: 1 })
			.limit(20)

		const deadlineReminders = internships.map((job) => {
			const deadlineDate = new Date(job.deadline)
			const diffMs = deadlineDate.getTime() - now.getTime()
			return {
				id: `job-${job._id}`,
				targetId: job._id,
				type: 'internship_deadline',
				title: `Deadline: ${job.title}`,
				subtitle: job.company,
				targetDate: job.deadline,
				diffMs: diffMs,
				isExpired: diffMs < 0,
				meta: {
					location: job.location,
					workMode: job.workMode,
					salaryRange: job.salaryRange
				}
			}
		})

		// 2. Fetch scheduled interviews for current user
		const interviews = await Interview.find({
			user: userId,
			status: 'Scheduled'
		}).sort({ date: 1 })

		const interviewReminders = interviews.map((item) => {
			const interviewDate = new Date(item.date)
			const diffMs = interviewDate.getTime() - now.getTime()
			return {
				id: `interview-${item._id}`,
				targetId: item._id,
				type: 'scheduled_interview',
				title: `Interview: ${item.position}`,
				subtitle: item.company,
				targetDate: item.date,
				diffMs: diffMs,
				isExpired: diffMs < 0,
				meta: {
					mode: item.mode,
					meetingLink: item.meetingLink,
					notes: item.notes
				}
			}
		})

		// 3. Fetch applications that haven't been updated for a long time (>= STALE_DAYS)
		const userApplications = await Application.find({
			student: userId,
			status: { $in: ['Applied', 'Under Review'] }
		})
			.populate('internship')
			.sort({ updatedAt: 1 })

		const staleReminders = userApplications
			.filter((app) => {
				const lastUpdated = new Date(app.updatedAt || app.appliedAt || app.createdAt || 0)
				return lastUpdated.getTime() <= staleThreshold.getTime()
			})
			.map((app) => {
				const lastUpdated = new Date(app.updatedAt || app.appliedAt || app.createdAt || 0)
				const elapsedMs = now.getTime() - lastUpdated.getTime()
				const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24))

				return {
					id: `app-${app._id}`,
					targetId: app._id,
					type: 'stale_application',
					title: `Application Pending: ${app.internship?.title || 'Internship'}`,
					subtitle: app.internship?.company || 'Company',
					targetDate: lastUpdated,
					diffMs: -elapsedMs, // negative indicates elapsed time
					elapsedDays: elapsedDays,
					isStale: true,
					meta: {
						status: app.status,
						appliedAt: app.appliedAt
					}
				}
			})

		// Aggregate summary counts
		const totalReminders = deadlineReminders.length + interviewReminders.length + staleReminders.length

		res.status(200).json({
			summary: {
				total: totalReminders,
				deadlinesCount: deadlineReminders.length,
				interviewsCount: interviewReminders.length,
				staleCount: staleReminders.length
			},
			deadlines: deadlineReminders,
			interviews: interviewReminders,
			staleApplications: staleReminders,
			all: [...interviewReminders, ...deadlineReminders, ...staleReminders]
		})
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

export default {
	getReminders
}
