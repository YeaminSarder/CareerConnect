import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import axios from '../../api/axios.js'

const ProfileEditorModal = ({ show, onHide, profile, initialTab = 'basic', onProfileUpdated }) => {
	const [activeTab, setActiveTab] = useState(initialTab)

	useEffect(() => {
		if (initialTab) {
			setActiveTab(initialTab)
		}
	}, [initialTab, show])

	// Basic Info
	const [photo, setPhoto] = useState('')
	const [bio, setBio] = useState('')
	const [contactPhone, setContactPhone] = useState('')
	const [contactEmail, setContactEmail] = useState('')
	const [location, setLocation] = useState('')
	const [department, setDepartment] = useState('')
	const [university, setUniversity] = useState('')

	// Education
	const [educationList, setEducationList] = useState([])
	const [eduUniv, setEduUniv] = useState('')
	const [eduDegree, setEduDegree] = useState('')
	const [eduMajor, setEduMajor] = useState('')
	const [eduCgpa, setEduCgpa] = useState('')

	// Categorized Skills
	const [skillsList, setSkillsList] = useState([])
	const [skillName, setSkillName] = useState('')
	const [skillCat, setSkillCat] = useState('Programming')

	// Experience
	const [experienceList, setExperienceList] = useState([])
	const [expTitle, setExpTitle] = useState('')
	const [expCompany, setExpCompany] = useState('')
	const [expType, setExpType] = useState('Internship')
	const [expDesc, setExpDesc] = useState('')

	// Project Portfolio
	const [projectsList, setProjectsList] = useState([])
	const [projTitle, setProjTitle] = useState('')
	const [projDesc, setProjDesc] = useState('')
	const [projTech, setProjTech] = useState('')
	const [projGithub, setProjGithub] = useState('')
	const [projDemo, setProjDemo] = useState('')

	// Certifications
	const [certsList, setCertsList] = useState([])
	const [certName, setCertName] = useState('')
	const [certOrg, setCertOrg] = useState('')
	const [certLink, setCertLink] = useState('')

	// Career Interests
	const [jobRoles, setJobRoles] = useState('')
	const [industries, setIndustries] = useState('')
	const [workModes, setWorkModes] = useState([])

	// Visibility
	const [visibility, setVisibility] = useState({
		basic: 'Public',
		education: 'Public',
		experience: 'Public',
		projects: 'Public',
		certifications: 'Public'
	})

	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	useEffect(() => {
		if (profile) {
			setPhoto(profile.photo || '')
			setBio(profile.bio || profile.description || '')
			setContactPhone(profile.contactPhone || '')
			setContactEmail(profile.contactEmail || '')
			setLocation(profile.location || '')
			setDepartment(profile.department || '')
			setUniversity(profile.university || 'BRAC University')

			setEducationList(profile.education || [])
			setSkillsList(profile.skills || [])
			setExperienceList(profile.experience || [])
			setProjectsList(profile.projects || [])
			setCertsList(profile.certifications || [])

			const ci = profile.careerInterests || {}
			setJobRoles(Array.isArray(ci.jobRoles) ? ci.jobRoles.join(', ') : '')
			setIndustries(Array.isArray(ci.industries) ? ci.industries.join(', ') : '')
			setWorkModes(Array.isArray(ci.workModes) ? ci.workModes : [])

			setVisibility(profile.visibility || {
				basic: 'Public',
				education: 'Public',
				experience: 'Public',
				projects: 'Public',
				certifications: 'Public'
			})
		}
	}, [profile])

	// Education handlers
	const handleAddEducation = () => {
		if (!eduUniv.trim() || !eduDegree.trim()) return
		setEducationList([...educationList, { university: eduUniv.trim(), degree: eduDegree.trim(), major: eduMajor.trim(), cgpa: eduCgpa.trim() }])
		setEduUniv('')
		setEduDegree('')
		setEduMajor('')
		setEduCgpa('')
	}

	// Skills handlers
	const handleAddSkill = () => {
		if (!skillName.trim()) return
		setSkillsList([...skillsList, { name: skillName.trim(), category: skillCat }])
		setSkillName('')
	}

	// Experience handlers
	const handleAddExperience = () => {
		if (!expTitle.trim() || !expCompany.trim()) return
		setExperienceList([...experienceList, { title: expTitle.trim(), companyOrOrg: expCompany.trim(), type: expType, description: expDesc.trim() }])
		setExpTitle('')
		setExpCompany('')
		setExpDesc('')
	}

	// Projects handlers
	const handleAddProject = () => {
		if (!projTitle.trim()) return
		const techArr = projTech.split(',').map(t => t.trim()).filter(t => t.length > 0)
		setProjectsList([...projectsList, { title: projTitle.trim(), description: projDesc.trim(), technologies: techArr, githubLink: projGithub.trim(), demoLink: projDemo.trim() }])
		setProjTitle('')
		setProjDesc('')
		setProjTech('')
		setProjGithub('')
		setProjDemo('')
	}

	// Certifications handlers
	const handleAddCert = () => {
		if (!certName.trim() || !certOrg.trim()) return
		setCertsList([...certsList, { name: certName.trim(), issuingOrganization: certOrg.trim(), credentialLink: certLink.trim() }])
		setCertName('')
		setCertOrg('')
		setCertLink('')
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)
		setError(null)

		const payload = {
			photo,
			bio,
			description: bio,
			contactPhone,
			contactEmail,
			location,
			department,
			university,
			education: educationList,
			skills: skillsList,
			experience: experienceList,
			projects: projectsList,
			certifications: certsList,
			careerInterests: {
				jobRoles: jobRoles.split(',').map(s => s.trim()).filter(s => s.length > 0),
				industries: industries.split(',').map(s => s.trim()).filter(s => s.length > 0),
				workModes
			},
			visibility,
			lastModifiedSection: activeTab
		}

		try {
			const res = await axios.patch('/myprofile', payload)
			setLoading(false)
			if (onProfileUpdated) onProfileUpdated(res.data)
			onHide()
		} catch (err) {
			setLoading(false)
			setError(err.response?.data?.error || 'Failed to update profile')
		}
	}

	return (
		<Modal show={show} onHide={onHide} size="xl" centered>
			<Modal.Header closeButton className="bg-primary text-white">
				<Modal.Title className="fw-bold fs-5">
					<i className="bi bi-pencil-square me-2"></i>Professional Profile Builder & Section Manager
				</Modal.Title>
			</Modal.Header>
			<Form onSubmit={handleSubmit}>
				<Modal.Body className="p-4" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
					{error && <div className="alert alert-danger py-2">{error}</div>}

					<Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
						{/* Tab 1: Basic Information */}
						<Tab eventKey="basic" title="Basic Info (15%)">
							<div className="row g-3">
								<div className="col-md-6">
									<Form.Label className="small fw-bold">Department / Major</Form.Label>
									<Form.Control type="text" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. Computer Science & Engineering" />
								</div>
								<div className="col-md-6">
									<Form.Label className="small fw-bold">University</Form.Label>
									<Form.Control type="text" value={university} onChange={(e) => setUniversity(e.target.value)} placeholder="e.g. BRAC University" />
								</div>
								<div className="col-md-6">
									<Form.Label className="small fw-bold">Location (City, Country)</Form.Label>
									<Form.Control type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Dhaka, Bangladesh" />
								</div>
								<div className="col-md-6">
									<Form.Label className="small fw-bold">Contact Phone / Email</Form.Label>
									<Form.Control type="text" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+880 1700-000000" />
								</div>
								<div className="col-md-12">
									<Form.Label className="small fw-bold">Professional Bio / About Me</Form.Label>
									<Form.Control as="textarea" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Describe your technical skills, passion, and career aspirations..." />
								</div>
							</div>
						</Tab>

						{/* Tab 2: Education History */}
						<Tab eventKey="education" title="Education (15%)">
							<div className="bg-light p-3 rounded-3 mb-3 border">
								<h6 className="fw-bold text-dark small mb-2">Add Education Record</h6>
								<div className="row g-2">
									<div className="col-md-4">
										<Form.Control size="sm" placeholder="University Name" value={eduUniv} onChange={(e) => setEduUniv(e.target.value)} />
									</div>
									<div className="col-md-3">
										<Form.Control size="sm" placeholder="Degree (B.Sc., M.Sc.)" value={eduDegree} onChange={(e) => setEduDegree(e.target.value)} />
									</div>
									<div className="col-md-3">
										<Form.Control size="sm" placeholder="Major / CGPA" value={eduMajor} onChange={(e) => setEduMajor(e.target.value)} />
									</div>
									<div className="col-md-2">
										<Button size="sm" variant="primary" className="w-100" onClick={handleAddEducation}>+ Add</Button>
									</div>
								</div>
							</div>
							<div className="d-flex flex-column gap-2">
								{educationList.map((edu, idx) => (
									<div key={idx} className="p-2 border rounded d-flex justify-content-between align-items-center">
										<div><strong>{edu.degree} in {edu.major}</strong> — <span className="text-muted">{edu.university}</span></div>
										<Button size="sm" variant="link" className="text-danger" onClick={() => setEducationList(educationList.filter((_, i) => i !== idx))}><i className="bi bi-trash"></i></Button>
									</div>
								))}
							</div>
						</Tab>

						{/* Tab 3: Categorized Skills */}
						<Tab eventKey="skills" title="Skills (15%)">
							<div className="bg-light p-3 rounded-3 mb-3 border">
								<h6 className="fw-bold text-dark small mb-2">Add Skill with Category</h6>
								<div className="row g-2">
									<div className="col-md-6">
										<Form.Control size="sm" placeholder="Skill Name (React, Python, Communication...)" value={skillName} onChange={(e) => setSkillName(e.target.value)} />
									</div>
									<div className="col-md-4">
										<Form.Select size="sm" value={skillCat} onChange={(e) => setSkillCat(e.target.value)}>
											<option value="Programming">Programming</option>
											<option value="Frameworks">Frameworks & Libraries</option>
											<option value="Communication">Communication</option>
											<option value="Leadership">Leadership & Management</option>
										</Form.Select>
									</div>
									<div className="col-md-2">
										<Button size="sm" variant="primary" className="w-100" onClick={handleAddSkill}>+ Add</Button>
									</div>
								</div>
							</div>
							<div className="d-flex flex-wrap gap-2">
								{skillsList.map((sk, idx) => (
									<span key={idx} className="badge bg-secondary fs-6 p-2 d-flex align-items-center gap-2">
										{sk.name} <small className="text-warning-emphasis">({sk.category})</small>
										<i className="bi bi-x-circle text-white cursor-pointer" onClick={() => setSkillsList(skillsList.filter((_, i) => i !== idx))}></i>
									</span>
								))}
							</div>
						</Tab>

						{/* Tab 4: Experience Section */}
						<Tab eventKey="experience" title="Experience (15%)">
							<div className="bg-light p-3 rounded-3 mb-3 border">
								<h6 className="fw-bold text-dark small mb-2">Add Internship / Work / Volunteer Experience</h6>
								<div className="row g-2">
									<div className="col-md-4">
										<Form.Control size="sm" placeholder="Job Title" value={expTitle} onChange={(e) => setExpTitle(e.target.value)} />
									</div>
									<div className="col-md-4">
										<Form.Control size="sm" placeholder="Company / Organization" value={expCompany} onChange={(e) => setExpCompany(e.target.value)} />
									</div>
									<div className="col-md-2">
										<Form.Select size="sm" value={expType} onChange={(e) => setExpType(e.target.value)}>
											<option value="Internship">Internship</option>
											<option value="Part-Time">Part-Time</option>
											<option value="Volunteer">Volunteer</option>
											<option value="Leadership">Leadership</option>
										</Form.Select>
									</div>
									<div className="col-md-2">
										<Button size="sm" variant="primary" className="w-100" onClick={handleAddExperience}>+ Add</Button>
									</div>
								</div>
							</div>
							<div className="d-flex flex-column gap-2">
								{experienceList.map((exp, idx) => (
									<div key={idx} className="p-2 border rounded d-flex justify-content-between align-items-center">
										<div><strong>{exp.title}</strong> @ {exp.companyOrOrg} <span className="badge bg-info text-dark">{exp.type}</span></div>
										<Button size="sm" variant="link" className="text-danger" onClick={() => setExperienceList(experienceList.filter((_, i) => i !== idx))}><i className="bi bi-trash"></i></Button>
									</div>
								))}
							</div>
						</Tab>

						{/* Tab 5: Project Portfolio */}
						<Tab eventKey="projects" title="Projects (20%)">
							<div className="bg-light p-3 rounded-3 mb-3 border">
								<h6 className="fw-bold text-dark small mb-2">Add Project to Portfolio</h6>
								<div className="row g-2">
									<div className="col-md-4">
										<Form.Control size="sm" placeholder="Project Title" value={projTitle} onChange={(e) => setProjTitle(e.target.value)} />
									</div>
									<div className="col-md-4">
										<Form.Control size="sm" placeholder="Technologies (comma-separated)" value={projTech} onChange={(e) => setProjTech(e.target.value)} />
									</div>
									<div className="col-md-4">
										<Form.Control size="sm" placeholder="GitHub Repository Link" value={projGithub} onChange={(e) => setProjGithub(e.target.value)} />
									</div>
									<div className="col-md-10">
										<Form.Control size="sm" placeholder="Short Project Description" value={projDesc} onChange={(e) => setProjDesc(e.target.value)} />
									</div>
									<div className="col-md-2">
										<Button size="sm" variant="primary" className="w-100" onClick={handleAddProject}>+ Add</Button>
									</div>
								</div>
							</div>
							<div className="d-flex flex-column gap-2">
								{projectsList.map((pj, idx) => (
									<div key={idx} className="p-2 border rounded d-flex justify-content-between align-items-center">
										<div><strong>{pj.title}</strong> — <small className="text-muted">{pj.description}</small></div>
										<Button size="sm" variant="link" className="text-danger" onClick={() => setProjectsList(projectsList.filter((_, i) => i !== idx))}><i className="bi bi-trash"></i></Button>
									</div>
								))}
							</div>
						</Tab>

						{/* Tab 6: Certifications & Interests */}
						<Tab eventKey="certs" title="Certs & Interests (20%)">
							<div className="row g-3">
								<div className="col-md-6 border-end">
									<h6 className="fw-bold text-dark small mb-2">Certifications (+10%)</h6>
									<div className="g-2 mb-2">
										<Form.Control size="sm" className="mb-1" placeholder="Certification Name" value={certName} onChange={(e) => setCertName(e.target.value)} />
										<Form.Control size="sm" className="mb-1" placeholder="Issuing Organization" value={certOrg} onChange={(e) => setCertOrg(e.target.value)} />
										<Button size="sm" variant="outline-primary" className="w-100" onClick={handleAddCert}>+ Add Certification</Button>
									</div>
									{certsList.map((ct, idx) => (
										<div key={idx} className="small border p-1 rounded mb-1 d-flex justify-content-between">
											<span>{ct.name} ({ct.issuingOrganization})</span>
											<i className="bi bi-trash text-danger cursor-pointer" onClick={() => setCertsList(certsList.filter((_, i) => i !== idx))}></i>
										</div>
									))}
								</div>

								<div className="col-md-6">
									<h6 className="fw-bold text-dark small mb-2">Career Interests (+10%)</h6>
									<Form.Label className="small">Preferred Job Roles (comma-separated)</Form.Label>
									<Form.Control size="sm" className="mb-2" value={jobRoles} onChange={(e) => setJobRoles(e.target.value)} placeholder="Full-Stack Dev, Data Analyst..." />
									<Form.Label className="small">Target Industries</Form.Label>
									<Form.Control size="sm" value={industries} onChange={(e) => setIndustries(e.target.value)} placeholder="Tech, Finance, Healthcare..." />
								</div>
							</div>
						</Tab>

						{/* Tab 7: Profile Visibility Controls */}
						<Tab eventKey="visibility" title="Visibility Settings">
							<h6 className="fw-bold text-dark mb-3">Control Who Can See Your Profile Sections</h6>
							<div className="row g-3">
								<div className="col-md-6">
									<Form.Label className="small fw-bold">Basic Profile Info</Form.Label>
									<Form.Select size="sm" value={visibility.basic} onChange={(e) => setVisibility({ ...visibility, basic: e.target.value })}>
										<option value="Public">Public (Everyone)</option>
										<option value="Connections Only">Connections Only</option>
										<option value="Private">Private</option>
									</Form.Select>
								</div>
								<div className="col-md-6">
									<Form.Label className="small fw-bold">Project Portfolio</Form.Label>
									<Form.Select size="sm" value={visibility.projects} onChange={(e) => setVisibility({ ...visibility, projects: e.target.value })}>
										<option value="Public">Public (Everyone)</option>
										<option value="Connections Only">Connections Only</option>
										<option value="Private">Private</option>
									</Form.Select>
								</div>
							</div>
						</Tab>
					</Tabs>
				</Modal.Body>

				<Modal.Footer className="bg-light">
					<Button variant="secondary" onClick={onHide}>Cancel</Button>
					<Button variant="primary" type="submit" disabled={loading}>
						{loading ? 'Saving Profile...' : 'Save & Calculate Completion Score (100%)'}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	)
}

export default ProfileEditorModal
