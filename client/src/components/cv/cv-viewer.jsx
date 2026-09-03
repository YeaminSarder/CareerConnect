import { Modal, Button } from 'react-bootstrap'
import { CvUsage } from './cv-usage.jsx'
const CvViewer = ({ cv, show, onHide }) => {
	if (!cv) return null

	return (
		<Modal show={show} onHide={onHide} centered>
			<Modal.Header closeButton>
				<Modal.Title>CV</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<div className="mb-3">
					<strong>Title</strong>
					<div>{cv.title}</div>
				</div>

				<div>
					<strong>Description</strong>
					<div>{cv.description || "no description"}</div>
				</div>
				<div className="mt-3">
					<CvUsage cvId={cv._id} />
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

export default CvViewer