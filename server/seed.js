import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import User from './models/user.js'
import Profile from './models/profile.js'
import Internship from './models/internship.js'
import Post from './models/post.js'
import Connection from './models/connection.js'

dotenv.config()

export const seedDatabase = async () => {
	try {
		console.log('🌱 Starting database seed check...')

		// 1. Seed Internships if none exist
		const internshipCount = await Internship.countDocuments()
		if (internshipCount === 0) {
			console.log('Seeding internships...')
			await Internship.insertMany([
				{
					title: 'Full-Stack Web Developer Intern',
					company: 'Google',
					location: 'Dhaka (Hybrid) / Remote',
					workMode: 'Hybrid',
					requiredSkills: ['React', 'Node.js', 'MongoDB', 'Express'],
					salaryRange: '$800 - $1,200 / month',
					deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
					description: 'Join Google engineering team to build scalable web applications using modern MERN stack. Work on real-world projects with senior mentors.',
					eligibilityCriteria: 'Minimum CGPA 3.3, CSE/SE majors, proficiency in JavaScript and Data Structures.',
					status: 'Open'
				},
				{
					title: 'Frontend React Engineer Intern',
					company: 'Microsoft',
					location: 'Remote',
					workMode: 'Remote',
					requiredSkills: ['React', 'JavaScript', 'Tailwind CSS', 'Redux'],
					salaryRange: '$1,000 / month',
					deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
					description: 'Collaborate with the Microsoft UI design team to craft fluid, accessible, and high-performance web components.',
					eligibilityCriteria: 'Current 3rd or 4th year student, strong portfolio of React web projects.',
					status: 'Open'
				},
				{
					title: 'Backend Node.js & API Developer Intern',
					company: 'Amazon Web Services (AWS)',
					location: 'Dhaka (Onsite)',
					workMode: 'Onsite',
					requiredSkills: ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'Docker'],
					salaryRange: '$900 / month',
					deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
					description: 'Design and deploy robust RESTful API microservices with high throughput and low latency database connections.',
					eligibilityCriteria: 'Good foundation in database management, REST API design, and asynchronous JS.',
					status: 'Open'
				},
				{
					title: 'AI & Machine Learning Engineering Intern',
					company: 'Meta AI',
					location: 'Remote',
					workMode: 'Remote',
					requiredSkills: ['Python', 'PyTorch', 'Data Analysis', 'Node.js'],
					salaryRange: '$1,500 / month',
					deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
					description: 'Build predictive career matching models and student skill analytics dashboards.',
					eligibilityCriteria: 'Prior coursework or projects in Machine Learning, Python, and PyTorch/TensorFlow.',
					status: 'Open'
				},
				{
					title: 'Cybersecurity & Cloud Systems Intern',
					company: 'Cloudflare',
					location: 'Dhaka (Hybrid)',
					workMode: 'Hybrid',
					requiredSkills: ['Network Security', 'Linux', 'Node.js', 'JWT Auth'],
					salaryRange: '$850 / month',
					deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
					description: 'Auditing authentication protocols, enforcing JWT token security, and safeguarding cloud deployment pipelines.',
					eligibilityCriteria: 'Basic understanding of OS security, Linux shell scripting, and web authentication.',
					status: 'Open'
				}
			])
			console.log('✅ 5 Internships seeded!')
		}

		// 2. Seed Sample Featured Students if none exist
		const userCount = await User.countDocuments()
		if (userCount <= 1) {
			console.log('Seeding sample student profiles...')
			const salt = await bcrypt.genSalt(10)
			const hashedPassword = await bcrypt.hash('Password123!', salt)

			const sampleStudents = [
				{
					name: 'Md Yeamin Sarder',
					email: 'yeamin@bracu.ac.bd',
					department: 'Computer Science & Engineering',
					description: 'Full-Stack Developer passionate about MERN stack and CV management systems.'
				},
				{
					name: 'Abdullah Al Faisal',
					email: 'faisal@bracu.ac.bd',
					department: 'Software Engineering',
					description: 'Backend specialist interested in microservices, MongoDB indexing, and cloud architecture.'
				},
				{
					name: 'Jillur Rahman Jihad',
					email: 'jihad@bracu.ac.bd',
					department: 'Computer Science',
					description: 'Frontend Engineer focused on modern React UI, animations, and clean UX design.'
				},
				{
					name: 'Sarah Jenkins',
					email: 'sarah.j@bracu.ac.bd',
					department: 'Data Science & AI',
					description: 'Data Scientist building career match scoring algorithms and analytics visualizers.'
				}
			]

			for (const s of sampleStudents) {
				const profile = await Profile.create({
					description: s.description,
					department: s.department,
					skills: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
					careerInterests: ['Software Engineering', 'Web Development']
				})

				await User.create({
					name: s.name,
					email: s.email,
					password: hashedPassword,
					profile: profile._id
				})
			}
			console.log('✅ Featured sample student accounts seeded!')
		}

		// 3. Seed Posts if none exist
		const postCount = await Post.countDocuments()
		if (postCount === 0) {
			console.log('Seeding sample feed posts...')
			const firstUser = await User.findOne({})
			const authorName = firstUser ? (firstUser.name || 'Md Yeamin Sarder') : 'Md Yeamin Sarder'
			const authorId = firstUser ? firstUser._id : new mongoose.Types.ObjectId()

			await Post.create([
				{
					author: authorId,
					authorName: authorName,
					title: '🚀 Thrilled to launch CareerConnect Sprint 1!',
					content: 'We just finished building our student professional networking platform featuring CV version control, skill-based recommendations, and career analytics!',
					likes: [],
					comments: [
						{
							userName: 'Md. Rakibul Haque',
							text: 'Awesome progress team! The UI and internship filtering system look super clean.'
						}
					],
					saves: []
				},
				{
					author: authorId,
					authorName: 'Sarah Jenkins',
					title: '💡 Tip for Landing Software Internships in 2026',
					content: 'Make sure your GitHub projects have clear README files and live demo links. Recruiters spend an average of 15 seconds inspecting portfolios!',
					likes: [],
					comments: [],
					saves: []
				}
			])
			console.log('✅ 2 Feed posts seeded!')
		}

		console.log('🌱 Database seeding completed successfully!')
	} catch (err) {
		console.error('Error seeding database:', err.message)
	}
}

export default seedDatabase
