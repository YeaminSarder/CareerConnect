import { Modal, Button, Badge } from 'react-bootstrap'

const ApplicationViewer = ({ application, show, onHide }) => {
	if (!application) return null

	return (
		<Modal show={show} onHide={onHide} centered>
			<Modal.Header closeButton>
				<Modal.Title>Application Details</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<div className="mb-3">
					<strong>Student</strong>
					<div>{application.student?.name || 'N/A'}</div>
				</div>

				<div className="mb-3">
					<strong>Internship</strong>
					<div>{application.internship?.title || 'N/A'}</div>
				</div>

				<div className="mb-3">
					<strong>Status</strong>
					<div>
						<Badge bg="primary">
							{application.status}
						</Badge>
					</div>
				</div>

				<div className="mb-3">
					<strong>Applied At</strong>
					<div>
						{new Date(application.appliedAt).toLocaleString()}
					</div>
				</div>

				<div>
					<strong>CV</strong>
					<div>
						{application.cv?.title || 'Submitted CV'}
					</div>
				</div>
			</Modal.Body>

			<Modal.Footer>
				<Button variant="secondary" onClick={onHide}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default ApplicationViewer