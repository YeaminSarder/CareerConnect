import React, { useState } from 'react'
import axios from '../../api/axios.js'
import { useAuthContext } from '../../hooks/use-auth-context.jsx'

const PostInteractions = ({ post, onPostUpdate }) => {
	const { user } = useAuthContext()
	const [commentText, setCommentText] = useState('')
	const [showComments, setShowComments] = useState(false)
	const [loading, setLoading] = useState(false)

	const isLiked = post.likes?.includes(user?._id)
	const isSaved = post.saves?.includes(user?._id)

	const handleLike = async () => {
		if (!user) return
		try {
			const res = await axios.patch(
				`/posts/${post._id}/like`,
				{},
				{ headers: { Authorization: `Bearer ${user.token}` } }
			)
			if (onPostUpdate) onPostUpdate(res.data)
		} catch (err) {
			console.error('Like failed:', err)
		}
	}

	const handleSave = async () => {
		if (!user) return
		try {
			const res = await axios.patch(
				`/posts/${post._id}/save`,
				{},
				{ headers: { Authorization: `Bearer ${user.token}` } }
			)
			if (onPostUpdate) onPostUpdate(res.data)
		} catch (err) {
			console.error('Save failed:', err)
		}
	}

	const handleCommentSubmit = async (e) => {
		e.preventDefault()
		if (!user || !commentText.trim()) return
		setLoading(true)
		try {
			const res = await axios.post(
				`/posts/${post._id}/comment`,
				{ text: commentText },
				{ headers: { Authorization: `Bearer ${user.token}` } }
			)
			setCommentText('')
			if (onPostUpdate) onPostUpdate(res.data)
		} catch (err) {
			console.error('Comment failed:', err)
		} finally {
			setLoading(false)
		}
	}

	const engagement = post.engagement || {
		totalLikes: post.likes ? post.likes.length : 0,
		totalComments: post.comments ? post.comments.length : 0,
		totalSaves: post.saves ? post.saves.length : 0
	}

	return (
		<div className="mt-3 pt-2 border-top">
			{/* Engagement Metrics Count Display (FR-10) */}
			<div className="d-flex justify-content-between text-muted small mb-2">
				<span>
					<i className="bi bi-hand-thumbs-up-fill text-primary me-1"></i>
					{engagement.totalLikes} Likes
				</span>
				<span>
					{engagement.totalComments} Comments • {engagement.totalSaves} Saves
				</span>
			</div>

			{/* Interactive Action Buttons (FR-9) */}
			<div className="d-flex justify-content-around border-top border-bottom py-1">
				<button
					className={`btn btn-sm ${isLiked ? 'btn-primary' : 'btn-outline-primary'} border-0 flex-fill me-1`}
					onClick={handleLike}
				>
					<i className="bi bi-hand-thumbs-up me-1"></i> {isLiked ? 'Liked' : 'Like'}
				</button>

				<button
					className="btn btn-sm btn-outline-secondary border-0 flex-fill me-1"
					onClick={() => setShowComments(!showComments)}
				>
					<i className="bi bi-chat-left-text me-1"></i> Comment
				</button>

				<button
					className={`btn btn-sm ${isSaved ? 'btn-success' : 'btn-outline-success'} border-0 flex-fill`}
					onClick={handleSave}
				>
					<i className="bi bi-bookmark-star me-1"></i> {isSaved ? 'Saved' : 'Save'}
				</button>
			</div>

			{/* Comments Section */}
			{showComments && (
				<div className="mt-3">
					<form onSubmit={handleCommentSubmit} className="d-flex gap-2 mb-3">
						<input
							type="text"
							className="form-control form-control-sm"
							placeholder="Write a comment..."
							value={commentText}
							onChange={(e) => setCommentText(e.target.value)}
							required
						/>
						<button type="submit" className="btn btn-sm btn-primary" disabled={loading}>
							Post
						</button>
					</form>

					{post.comments && post.comments.length > 0 ? (
						<div className="d-flex flex-column gap-2">
							{post.comments.map((c, i) => (
								<div key={i} className="bg-light p-2 rounded small">
									<strong>{c.userName || 'Student'}: </strong>
									<span>{c.text}</span>
								</div>
							))}
						</div>
					) : (
						<small className="text-muted">No comments yet. Be the first to comment!</small>
					)}
				</div>
			)}
		</div>
	)
}

export default PostInteractions
