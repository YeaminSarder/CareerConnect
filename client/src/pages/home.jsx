import { useEffect, useState } from 'react'
import { useAuthContext } from '../hooks/use-auth-context'
import { getFeed } from '../api/feed'
import { createPost, updatePost, deletePost } from '../api/posts'
import PostInteractions from '../components/rakibul/PostInteractions'
import ReminderAlerts from '../components/ReminderAlerts'

const POST_TYPES = [
    'General Update',
    'Project Update',
    'Internship Achievement',
    'Certification Completion',
    'Learning Progress',
    'Hiring Opportunity'
]

const Home = () => {
    const { user } = useAuthContext()
    const [posts, setPosts] = useState([])
    const [newPostTitle, setNewPostTitle] = useState('')
    const [newPostContent, setNewPostContent] = useState('')
    const [newPostType, setNewPostType] = useState('General Update')
    const [posting, setPosting] = useState(false)

    const [editingId, setEditingId] = useState(null)
    const [editTitle, setEditTitle] = useState('')
    const [editContent, setEditContent] = useState('')
    const [editType, setEditType] = useState('General Update')

    // Connection-Based News Feed Algorithm
    const fetchFeed = async () => {
        try {
            const res = await getFeed()
            setPosts(res.data)
        } catch (err) {
            console.error('Error fetching feed:', err)
        }
    }

    useEffect(() => {
        fetchFeed()
    }, [])

    const handleCreatePost = async (e) => {
        e.preventDefault()
        if (!newPostContent.trim()) return
        setPosting(true)
        try {
            await createPost({
                title: newPostTitle,
                content: newPostContent,
                postType: newPostType
            })
            setNewPostTitle('')
            setNewPostContent('')
            setNewPostType('General Update')
            fetchFeed()
        } catch (err) {
            console.error('Error creating post:', err)
        } finally {
            setPosting(false)
        }
    }

    const handlePostUpdate = (updatedPost) => {
        setPosts((prev) =>
            prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
        )
    }

    const startEdit = (post) => {
        setEditingId(post._id)
        setEditTitle(post.title || '')
        setEditContent(post.content || '')
        setEditType(post.postType || 'General Update')
    }

    const cancelEdit = () => {
        setEditingId(null)
    }

    const saveEdit = async (postId) => {
        try {
            const res = await updatePost(postId, {
                title: editTitle,
                content: editContent,
                postType: editType
            })
            handlePostUpdate(res.data)
            setEditingId(null)
        } catch (err) {
            console.error('Error updating post:', err)
        }
    }

    const handleDelete = async (postId) => {
        try {
            await deletePost(postId)
            setPosts((prev) => prev.filter((p) => p._id !== postId))
        } catch (err) {
            console.error('Error deleting post:', err)
        }
    }

    return (
        <div className="container py-4" style={{ maxWidth: '800px' }}>
            {/* FR-Deadline & Interview Reminder Center */}
            {user && <ReminderAlerts />}

            <h4 className="fw-bold mb-4 text-primary">
                <i className="bi bi-newspaper me-2"></i>Student Professional News Feed
            </h4>

            {/* Create Post Form - Career Activity Post System */}
            {user && (
                <div className="card shadow-sm border-0 p-3 mb-4 rounded-3">
                    <h6 className="fw-bold mb-2">Create Career Post</h6>
                    <form onSubmit={handleCreatePost}>
                        <select
                            className="form-select form-select-sm mb-2"
                            value={newPostType}
                            onChange={(e) => setNewPostType(e.target.value)}
                        >
                            {POST_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            className="form-control form-control-sm mb-2"
                            placeholder="Post Title (optional)"
                            value={newPostTitle}
                            onChange={(e) => setNewPostTitle(e.target.value)}
                        />
                        <textarea
                            className="form-control form-control-sm mb-2"
                            rows="3"
                            placeholder="Share an internship update, project achievement, or learning progress..."
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            required
                        ></textarea>
                        <div className="d-flex justify-content-end">
                            <button type="submit" className="btn btn-sm btn-primary" disabled={posting}>
                                {posting ? 'Posting...' : 'Post Update'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Posts List */}
            <div className="d-flex flex-column gap-3">
                {posts.map((post) => {
                    const isOwner = user && String(post.author) === String(user._id)
                    const isEditing = editingId === post._id

                    return (
                        <div key={post._id} className="card shadow-sm border-0 p-3 rounded-3">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <div className="d-flex align-items-center">
                                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '38px', height: '38px', fontWeight: 'bold' }}>
                                        {post.authorName ? post.authorName.charAt(0) : 'S'}
                                    </div>
                                    <div>
                                        <strong className="d-block leading-tight">{post.authorName || 'Student'}</strong>
                                        <small className="text-muted">{post.postType || 'General Update'}</small>
                                    </div>
                                </div>

                                {isOwner && !isEditing && (
                                    <div className="d-flex gap-1">
                                        <button
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={() => startEdit(post)}
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(post._id)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {isEditing ? (
                                <div className="mb-2">
                                    <select
                                        className="form-select form-select-sm mb-2"
                                        value={editType}
                                        onChange={(e) => setEditType(e.target.value)}
                                    >
                                        {POST_TYPES.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm mb-2"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        placeholder="Title"
                                    />
                                    <textarea
                                        className="form-control form-control-sm mb-2"
                                        rows="3"
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                    ></textarea>
                                    <div className="d-flex gap-2 justify-content-end">
                                        <button className="btn btn-sm btn-secondary" onClick={cancelEdit}>
                                            Cancel
                                        </button>
                                        <button className="btn btn-sm btn-primary" onClick={() => saveEdit(post._id)}>
                                            Save
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {post.title && <h6 className="fw-bold text-dark mb-1">{post.title}</h6>}
                                    <p className="text-secondary mb-2">{post.content}</p>
                                </>
                            )}

                            <PostInteractions post={post} onPostUpdate={handlePostUpdate} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Home
