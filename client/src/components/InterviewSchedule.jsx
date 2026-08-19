import { useEffect, useState } from 'react'
import axios from '../api/axios.js'
import { calculateRemainingTime } from '../utils/reminderUtils.js'

// Interview Schedule and Preparation Module
const InterviewSchedule = () => {
	const [interviews, setInterviews] = useState([])
	const [form, setForm] = useState({ company: '', position: '', date: '', meetingLink: '', mode: 'Online' })
	const [newTask, setNewTask] = useState({})
	const [feedbackDraft, setFeedbackDraft] = useState({})
	const [, setTick] = useState(0)

	const fetchInterviews = async () => {
		try {
			const res = await axios.get('/interviews')
			setInterviews(res.data)
		} catch (err) {
			console.error('Error fetching interviews:', err)
		}
	}

	useEffect(() => {
		fetchInterviews()
	}, [])

	// Ticker for real-time countdown updates
	useEffect(() => {
		const timer = setInterval(() => {
			setTick((prev) => prev + 1)
		}, 1000)
		return () => clearInterval(timer)
	}, [])

	const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

	const handleCreate = async (e) => {
		e.preventDefault()
		try {
			await axios.post('/interviews', form)
			setForm({ company: '', position: '', date: '', meetingLink: '', mode: 'Online' })
			fetchInterviews()
		} catch (err) {
			console.error('Error creating interview:', err)
		}
	}

	const handleDelete = async (id) => {
		try {
			await axios.delete(`/interviews/${id}`)
			fetchInterviews()
		} catch (err) {
			console.error('Error deleting interview:', err)
		}
	}

	const handleAddTask = async (interviewId) => {
		const task = newTask[interviewId]
		if (!task) return
		try {
			await axios.post(`/interviews/${interviewId}/checklist`, { task })
			setNewTask({ ...newTask, [interviewId]: '' })
			fetchInterviews()
		} catch (err) {
			console.error('Error adding checklist item:', err)
		}
	}

	const handleToggleTask = async (interviewId, itemId) => {
		try {
			await axios.patch(`/interviews/${interviewId}/checklist/${itemId}`)
			fetchInterviews()
		} catch (err) {
			console.error('Error toggling checklist item:', err)
		}
	}

	const handleMarkCompleted = async (interview) => {
		try {
			await axios.patch(`/interviews/${interview._id}`, {
				status: 'Completed',
				postInterviewFeedback: feedbackDraft[interview._id] || interview.postInterviewFeedback
			})
			fetchInterviews()
		} catch (err) {
			console.error('Error saving feedback:', err)
		}
	}

	return (
		<div className="container py-4" style={{ maxWidth: '800px' }}>
			<h4 className="fw-bold mb-4 text-primary">
				<i className="bi bi-calendar-check-fill me-2"></i>Interview Schedule & Preparation
			</h4>

			<div className="card shadow-sm border-0 p-3 mb-4 rounded-3">
				<h6 className="fw-bold mb-2">Schedule a New Interview</h6>
				<form onSubmit={handleCreate}>
					<div className="row g-2 mb-2">
						<div className="col-md-6">
							<input
								name="company"
								className="form-control form-control-sm"
								placeholder="Company"
								value={form.company}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="col-md-6">
							<input
								name="position"
								className="form-control form-control-sm"
								placeholder="Position"
								value={form.position}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="col-md-6">
							<input
								type="datetime-local"
								name="date"
								className="form-control form-control-sm"
								value={form.date}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="col-md-6">
							<select name="mode" className="form-select form-select-sm" value={form.mode} onChange={handleChange}>
								<option value="Online">Online</option>
								<option value="In-Person">In-Person</option>
							</select>
						</div>
						<div className="col-md-12">
							<input
								name="meetingLink"
								className="form-control form-control-sm"
								placeholder="Meeting link (optional)"
								value={form.meetingLink}
								onChange={handleChange}
							/>
						</div>
					</div>
					<button type="submit" className="btn btn-sm btn-primary">
						Schedule Interview
					</button>
				</form>
			</div>

			{interviews.map((interview) => {
				const countdown = interview.status === 'Scheduled' ? calculateRemainingTime(interview.date) : null
				return (
					<div key={interview._id} className="card shadow-sm border-0 p-3 mb-3 rounded-3">
						<div className="d-flex justify-content-between align-items-start">
							<div>
								<div className="d-flex align-items-center gap-2 mb-1">
									<h6 className="fw-bold mb-0">
										{interview.position} at {interview.company}
									</h6>
									{countdown && (
										<span className={`badge font-monospace ${countdown.urgency === 'danger' ? 'bg-danger text-white' : countdown.urgency === 'warning' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>
											<i className="bi bi-clock me-1"></i>
											{countdown.text}
										</span>
									)}
								</div>
								<small className="text-muted">
									{new Date(interview.date).toLocaleString()} · {interview.mode} · {interview.status}
								</small>
								{interview.meetingLink && (
									<div>
										<a href={interview.meetingLink} target="_blank" rel="noreferrer" className="small">
											<i className="bi bi-camera-video me-1"></i>Meeting link
										</a>
									</div>
								)}
							</div>
							<button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(interview._id)}>
								<i className="bi bi-trash"></i>
							</button>
						</div>

					<hr />
					<h6 className="fw-bold small mb-2">Preparation Checklist</h6>
					{interview.prepChecklist.map((item) => (
						<div key={item._id} className="form-check">
							<input
								type="checkbox"
								className="form-check-input"
								checked={item.done}
								onChange={() => handleToggleTask(interview._id, item._id)}
							/>
							<label
								className="form-check-label"
								style={{ textDecoration: item.done ? 'line-through' : 'none' }}
							>
								{item.task}
							</label>
						</div>
					))}

					<div className="d-flex gap-2 mt-2 mb-3">
						<input
							className="form-control form-control-sm"
							placeholder="Add prep task"
							value={newTask[interview._id] || ''}
							onChange={(e) => setNewTask({ ...newTask, [interview._id]: e.target.value })}
						/>
						<button className="btn btn-sm btn-outline-primary" onClick={() => handleAddTask(interview._id)}>
							Add
						</button>
					</div>

					<hr />
					<h6 className="fw-bold small mb-2">Post-Interview Feedback</h6>
					<textarea
						className="form-control form-control-sm mb-2"
						rows="2"
						placeholder="How did it go? Notes for next time..."
						value={
							feedbackDraft[interview._id] !== undefined
								? feedbackDraft[interview._id]
								: interview.postInterviewFeedback
						}
						onChange={(e) => setFeedbackDraft({ ...feedbackDraft, [interview._id]: e.target.value })}
					/>
					<button className="btn btn-sm btn-outline-success" onClick={() => handleMarkCompleted(interview)}>
						Save Feedback & Mark Completed
					</button>
				</div>
			)
			})}
		</div>
	)
}

export default InterviewSchedule
