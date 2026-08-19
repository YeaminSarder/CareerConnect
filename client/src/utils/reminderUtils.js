/**
 * Utility functions for calculating dynamic remaining time countdowns
 * and elapsed time for reminders, interview schedules, and internship deadlines.
 */

export const calculateRemainingTime = (targetDateStr) => {
	if (!targetDateStr) {
		return { text: 'No date set', urgency: 'secondary', isExpired: false, totalMs: 0 }
	}

	const target = new Date(targetDateStr)
	const now = new Date()
	const diffMs = target.getTime() - now.getTime()

	if (isNaN(target.getTime())) {
		return { text: 'Invalid date', urgency: 'secondary', isExpired: false, totalMs: 0 }
	}

	if (diffMs <= 0) {
		const pastMs = Math.abs(diffMs)
		const pastHours = Math.floor(pastMs / (1000 * 60 * 60))
		const pastDays = Math.floor(pastHours / 24)

		if (pastDays > 0) {
			return { text: `Expired ${pastDays} day${pastDays > 1 ? 's' : ''} ago`, urgency: 'secondary', isExpired: true, totalMs: diffMs }
		} else if (pastHours > 0) {
			return { text: `Expired ${pastHours} hour${pastHours > 1 ? 's' : ''} ago`, urgency: 'secondary', isExpired: true, totalMs: diffMs }
		} else {
			return { text: 'Expired recently', urgency: 'secondary', isExpired: true, totalMs: diffMs }
		}
	}

	const totalSeconds = Math.floor(diffMs / 1000)
	const days = Math.floor(totalSeconds / (3600 * 24))
	const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600)
	const minutes = Math.floor((totalSeconds % 3600) / 60)
	const seconds = totalSeconds % 60

	// Determine urgency level
	let urgency = 'info'
	if (days === 0 && hours < 24) {
		urgency = 'danger' // Urgent (< 24 hours)
	} else if (days <= 3) {
		urgency = 'warning' // Moderate (< 3 days)
	}

	// Format display text
	let text = ''
	if (days > 0) {
		text = `${days}d ${hours}h ${minutes}m left`
	} else if (hours > 0) {
		text = `${hours}h ${minutes}m ${seconds}s left`
	} else {
		text = `${minutes}m ${seconds}s left`
	}

	return {
		text,
		days,
		hours,
		minutes,
		seconds,
		urgency,
		isExpired: false,
		totalMs: diffMs
	}
}

export const calculateStaleTime = (updatedAtStr) => {
	if (!updatedAtStr) return { text: 'Unknown date', days: 0 }
	const updated = new Date(updatedAtStr)
	const now = new Date()
	const diffMs = now.getTime() - updated.getTime()
	const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))

	return {
		text: `${days} day${days !== 1 ? 's' : ''} without update`,
		days,
		urgency: days >= 14 ? 'danger' : 'warning'
	}
}
