import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { getReminders } from '../api/reminder.js'
import { calculateRemainingTime } from '../utils/reminderUtils.js'

const NotificationDropdown = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [data, setData] = useState({
		summary: { total: 0, deadlinesCount: 0, interviewsCount: 0, staleCount: 0 },
		all: []
	})
	const [, setTick] = useState(0)
	const dropdownRef = useRef(null)

	const fetchReminders = async () => {
		try {
			const res = await getReminders()
			if (res.data) {
				setData(res.data)
			}
		} catch (err) {
			console.error('Error loading notification bell reminders:', err)
		}
	}

	useEffect(() => {
		fetchReminders()
	}, [])

	// Live ticker every 2 seconds for dropdown badge
	useEffect(() => {
		const interval = setInterval(() => {
			setTick((prev) => prev + 1)
		}, 2000)
		return () => clearInterval(interval)
	}, [])

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const totalCount = data.summary.total || 0

	return (
		<div className="position-relative d-inline-block" ref={dropdownRef}>
			<button
				className="btn btn-link nav-link position-relative px-2 py-1 text-light border-0"
				onClick={() => {
					setIsOpen(!isOpen)
					if (!isOpen) fetchReminders()
				}}
				title="Deadline & Interview Notifications"
			>
				<i className="bi bi-bell-fill fs-5"></i>
				{totalCount > 0 && (
					<span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shadow-sm">
						{totalCount}
						<span className="visually-hidden">unread reminders</span>
					</span>
				)}
			</button>

			{isOpen && (
				<div
					className="dropdown-menu dropdown-menu-end show p-0 shadow-lg border-0 rounded-3 position-absolute"
					style={{ width: '340px', right: 0, top: '100%', zIndex: 1050 }}
				>
					<div className="p-3 bg-primary text-white rounded-top-3 d-flex justify-content-between align-items-center">
						<div className="fw-bold">
							<i className="bi bi-bell me-2"></i>Active Reminders
						</div>
						<span className="badge bg-white text-primary rounded-pill">{totalCount} Alerts</span>
					</div>

					<div className="list-group list-group-flush overflow-auto" style={{ maxHeight: '300px' }}>
						{data.all.length === 0 ? (
							<div className="p-3 text-center text-muted small">
								<i className="bi bi-check-circle me-1 text-success"></i>No pending reminders!
							</div>
						) : (
							data.all.slice(0, 5).map((item) => {
								const countdown = calculateRemainingTime(item.targetDate)
								let icon = 'bi-hourglass-split text-danger'
								let link = '/internships'

								if (item.type === 'scheduled_interview') {
									icon = 'bi-calendar-event text-info'
									link = '/interviews-schedule'
								} else if (item.type === 'stale_application') {
									icon = 'bi-exclamation-circle text-warning'
									link = '/internships'
								}

								return (
									<Link
										key={item.id}
										to={link}
										className="list-group-item list-group-item-action p-3 d-flex align-items-start gap-2"
										onClick={() => setIsOpen(false)}
									>
										<i className={`bi ${icon} fs-5 mt-1`}></i>
										<div className="w-100">
											<div className="fw-semibold text-dark small mb-0">{item.title}</div>
											<div className="text-muted extra-small">{item.subtitle}</div>
											<div className="d-flex justify-content-between align-items-center mt-1">
												<span className="badge bg-light text-dark border extra-small">
													{item.type === 'stale_application'
														? `Stale: ${item.elapsedDays}d`
														: countdown.text}
												</span>
												<small className="text-primary text-decoration-none extra-small">View &rarr;</small>
											</div>
										</div>
									</Link>
								)
							})
						)}
					</div>

					<div className="p-2 bg-light text-center rounded-bottom-3 border-top">
						<Link
							to="/"
							className="text-primary fw-semibold small text-decoration-none"
							onClick={() => setIsOpen(false)}
						>
							View All Reminders on Dashboard &rarr;
						</Link>
					</div>
				</div>
			)}
		</div>
	)
}

export default NotificationDropdown
