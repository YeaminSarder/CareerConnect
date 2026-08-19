import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getReminders } from '../api/reminder.js'
import { calculateRemainingTime, calculateStaleTime } from '../utils/reminderUtils.js'

const ReminderAlerts = ({ compact = false, limit = 0 }) => {
	const [data, setData] = useState({
		summary: { total: 0, deadlinesCount: 0, interviewsCount: 0, staleCount: 0 },
		deadlines: [],
		interviews: [],
		staleApplications: [],
		all: []
	})
	const [loading, setLoading] = useState(true)
	const [activeFilter, setActiveFilter] = useState('all') // 'all' | 'deadlines' | 'interviews' | 'stale'
	const [searchTerm, setSearchTerm] = useState('')
	const [, setTick] = useState(0)

	const fetchRemindersData = async () => {
		try {
			const res = await getReminders()
			if (res.data) {
				setData(res.data)
			}
		} catch (err) {
			console.error('Error fetching reminders:', err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchRemindersData()
	}, [])

	// Live ticker to update countdown every 1 second
	useEffect(() => {
		const timer = setInterval(() => {
			setTick((prev) => prev + 1)
		}, 1000)
		return () => clearInterval(timer)
	}, [])

	const getFilteredItems = () => {
		let items = []
		if (activeFilter === 'deadlines') items = data.deadlines
		else if (activeFilter === 'interviews') items = data.interviews
		else if (activeFilter === 'stale') items = data.staleApplications
		else items = data.all

		if (searchTerm.trim()) {
			const query = searchTerm.toLowerCase()
			items = items.filter(
				(item) =>
					item.title.toLowerCase().includes(query) ||
					item.subtitle.toLowerCase().includes(query)
			)
		}

		if (limit > 0) {
			return items.slice(0, limit)
		}
		return items
	}

	const renderBadge = (urgency) => {
		switch (urgency) {
			case 'danger':
				return 'bg-danger text-white'
			case 'warning':
				return 'bg-warning text-dark'
			case 'info':
				return 'bg-info text-dark'
			default:
				return 'bg-secondary text-white'
		}
	}

	if (loading) {
		return (
			<div className="card shadow-sm border-0 rounded-4 p-4 mb-4 bg-white">
				<div className="d-flex align-items-center gap-3">
					<div className="spinner-border text-primary spinner-border-sm" role="status"></div>
					<span className="text-muted small">Loading deadline & interview reminders...</span>
				</div>
			</div>
		)
	}

	const filteredList = getFilteredItems()

	return (
		<div className="card shadow-sm border-0 rounded-4 p-4 mb-4 bg-white">
			{/* Top Header */}
			<div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3">
				<div>
					<h5 className="fw-bold text-primary mb-1 d-flex align-items-center gap-2">
						<i className="bi bi-bell-fill text-warning"></i>
						<span>Deadline & Interview Reminder Center</span>
					</h5>
					<p className="text-muted small mb-0">
						Stay on top of upcoming internship deadlines, interview schedules, and pending application updates.
					</p>
				</div>
				<button
					className="btn btn-sm btn-outline-primary align-self-start align-self-md-auto"
					onClick={fetchRemindersData}
					title="Refresh reminders"
				>
					<i className="bi bi-arrow-clockwise me-1"></i>Refresh
				</button>
			</div>

			{/* Filter Tabs & Search */}
			<div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3">
				<div className="d-flex flex-wrap gap-2">
					<button
						className={`btn btn-sm ${activeFilter === 'all' ? 'btn-primary shadow-sm' : 'btn-light border'}`}
						onClick={() => setActiveFilter('all')}
					>
						All Alerts <span className="badge bg-white text-dark ms-1">{data.summary.total}</span>
					</button>
					<button
						className={`btn btn-sm ${activeFilter === 'deadlines' ? 'btn-danger shadow-sm' : 'btn-light border'}`}
						onClick={() => setActiveFilter('deadlines')}
					>
						<i className="bi bi-hourglass-split me-1"></i>Deadlines{' '}
						<span className="badge bg-white text-dark ms-1">{data.summary.deadlinesCount}</span>
					</button>
					<button
						className={`btn btn-sm ${activeFilter === 'interviews' ? 'btn-info text-white shadow-sm' : 'btn-light border'}`}
						onClick={() => setActiveFilter('interviews')}
					>
						<i className="bi bi-calendar-event-fill me-1"></i>Interviews{' '}
						<span className="badge bg-white text-dark ms-1">{data.summary.interviewsCount}</span>
					</button>
					<button
						className={`btn btn-sm ${activeFilter === 'stale' ? 'btn-warning text-dark shadow-sm' : 'btn-light border'}`}
						onClick={() => setActiveFilter('stale')}
					>
						<i className="bi bi-exclamation-triangle-fill me-1"></i>Stale Applications{' '}
						<span className="badge bg-white text-dark ms-1">{data.summary.staleCount}</span>
					</button>
				</div>
				<div className="input-group input-group-sm style-search" style={{ maxWidth: '220px' }}>
					<span className="input-group-text bg-light border-end-0"><i className="bi bi-search text-muted"></i></span>
					<input
						type="text"
						className="form-control border-start-0"
						placeholder="Search alerts..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</div>

			{/* Content List */}
			{filteredList.length === 0 ? (
				<div className="text-center py-4 bg-light rounded-3 border">
					<i className="bi bi-check-circle-fill text-success fs-3 d-block mb-1"></i>
					<h6 className="fw-bold mb-1">No Active Alerts</h6>
					<p className="text-muted small mb-0">You're all caught up! No urgent deadlines or upcoming interviews.</p>
				</div>
			) : (
				<div className="d-flex flex-column gap-2">
					{filteredList.map((item) => {
						if (item.type === 'internship_deadline') {
							const countdown = calculateRemainingTime(item.targetDate)
							return (
								<div
									key={item.id}
									className="p-3 rounded-3 border bg-light d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2"
								>
									<div className="d-flex align-items-center gap-3">
										<div className="p-2 rounded-circle bg-danger-subtle text-danger">
											<i className="bi bi-hourglass-bottom fs-4"></i>
										</div>
										<div>
											<div className="fw-bold text-dark">{item.title}</div>
											<small className="text-muted me-2">
												<i className="bi bi-building me-1"></i>
												{item.subtitle}
											</small>
											<small className="text-muted">
												Deadline: {new Date(item.targetDate).toLocaleDateString()}
											</small>
										</div>
									</div>
									<div className="d-flex align-items-center gap-2 ms-sm-auto">
										<span className={`badge px-3 py-2 rounded-pill font-monospace ${renderBadge(countdown.urgency)}`}>
											<i className="bi bi-clock me-1"></i>
											{countdown.text}
										</span>
										<Link to="/internships" className="btn btn-sm btn-outline-primary">
											Explore <i className="bi bi-arrow-right"></i>
										</Link>
									</div>
								</div>
							)
						}

						if (item.type === 'scheduled_interview') {
							const countdown = calculateRemainingTime(item.targetDate)
							return (
								<div
									key={item.id}
									className="p-3 rounded-3 border bg-light d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2"
								>
									<div className="d-flex align-items-center gap-3">
										<div className="p-2 rounded-circle bg-info-subtle text-info">
											<i className="bi bi-person-video3 fs-4"></i>
										</div>
										<div>
											<div className="fw-bold text-dark">{item.title}</div>
											<small className="text-muted me-2">
												<i className="bi bi-building me-1"></i>
												{item.subtitle}
											</small>
											<small className="text-muted">
												{new Date(item.targetDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
											</small>
										</div>
									</div>
									<div className="d-flex align-items-center gap-2 ms-sm-auto">
										<span className={`badge px-3 py-2 rounded-pill font-monospace ${renderBadge(countdown.urgency)}`}>
											<i className="bi bi-stopwatch me-1"></i>
											{countdown.text}
										</span>
										<Link to="/interviews-schedule" className="btn btn-sm btn-primary">
											Prep & Notes <i className="bi bi-arrow-right"></i>
										</Link>
									</div>
								</div>
							)
						}

						if (item.type === 'stale_application') {
							const staleInfo = calculateStaleTime(item.targetDate)
							return (
								<div
									key={item.id}
									className="p-3 rounded-3 border bg-light d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2"
								>
									<div className="d-flex align-items-center gap-3">
										<div className="p-2 rounded-circle bg-warning-subtle text-warning">
											<i className="bi bi-exclamation-triangle fs-4"></i>
										</div>
										<div>
											<div className="fw-bold text-dark">{item.title}</div>
											<small className="text-muted me-2">
												<i className="bi bi-building me-1"></i>
												{item.subtitle}
											</small>
											<span className="badge bg-secondary-subtle text-secondary me-2">
												Status: {item.meta?.status}
											</span>
										</div>
									</div>
									<div className="d-flex align-items-center gap-2 ms-sm-auto">
										<span className="badge bg-warning text-dark px-3 py-2 rounded-pill">
											<i className="bi bi-clock-history me-1"></i>
											{staleInfo.text}
										</span>
										<Link to="/internships" className="btn btn-sm btn-outline-warning text-dark">
											Check Tracker <i className="bi bi-arrow-right"></i>
										</Link>
									</div>
								</div>
							)
						}

						return null
					})}
				</div>
			)}
		</div>
	)
}

export default ReminderAlerts
