import { useEffect, useState } from 'react'
import { useAuthContext } from '../hooks/use-auth-context'
import axios from '../api/axios'
import PostInteractions from '../components/rakibul/PostInteractions'

const Home = () => {
    const { user } = useAuthContext()
    const [posts, setPosts] = useState([
        {
            _id: 'demo-post-1',
            authorName: 'Yeamin Sarder',
            title: 'Full-Stack Developer Internship Opportunities',
            content: 'Excited to share that our team has uploaded the latest CV version control and profile builder tools! Check it out.',
            likes: ['demo-user-2'],
            comments: [
                { userName: 'Rakibul Haque', text: 'Great progress team! Looking forward to testing.' }
            ],
            saves: []
        }
    ])
    const [newPostTitle, setNewPostTitle] = useState('')
    const [newPostContent, setNewPostContent] = useState('')
    const [posting, setPosting] = useState(false)

    const fetchPosts = async () => {
        try {
            const res = await axios.get('/api/posts')
            if (res.data && res.data.length > 0) {
                setPosts(res.data)
            }
        } catch (err) {
            console.error('Error fetching posts:', err)
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    const handleCreatePost = async (e) => {
        e.preventDefault()
        if (!newPostContent.trim()) return
        setPosting(true)
        try {
            await axios.post(
                '/api/posts',
                { title: newPostTitle, content: newPostContent },
                { headers: { Authorization: `Bearer ${user.token}` } }
            )
            setNewPostTitle('')
            setNewPostContent('')
            fetchPosts()
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

    return (
        <div className="container py-4" style={{ maxWidth: '800px' }}>
            <h4 className="fw-bold mb-4 text-primary">
                <i className="bi bi-newspaper me-2"></i>Student Professional News Feed
            </h4>

            {/* Create Post Form */}
            {user && (
                <div className="card shadow-sm border-0 p-3 mb-4 rounded-3">
                    <h6 className="fw-bold mb-2">Create Career Post</h6>
                    <form onSubmit={handleCreatePost}>
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
                {posts.map((post) => (
                    <div key={post._id} className="card shadow-sm border-0 p-3 rounded-3">
                        <div className="d-flex align-items-center mb-2">
                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '38px', height: '38px', fontWeight: 'bold' }}>
                                {post.authorName ? post.authorName.charAt(0) : 'S'}
                            </div>
                            <div>
                                <strong className="d-block leading-tight">{post.authorName || 'Student'}</strong>
                                <small className="text-muted">Student Professional</small>
                            </div>
                        </div>

                        {post.title && <h6 className="fw-bold text-dark mb-1">{post.title}</h6>}
                        <p className="text-secondary mb-2">{post.content}</p>

                        {/* FR-9 & FR-10: Like, Comment, Save, and Engagement Tracker */}
                        <PostInteractions post={post} onPostUpdate={handlePostUpdate} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Home
