import { Modal, Button, Spinner } from 'react-bootstrap'
import { CvUsage } from './cv-usage.jsx'
import { useModal } from '../../hooks/use-modal'
import { useEffect, useState } from 'react'
import api from '../../api/axios.js'

const CvViewer = ({ cv, show, onHide }) => {
	const { show: showPdf, onHide: onHidePdf, openModal: openPdfModal } = useModal()
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
				<div className="mb-3">
					<strong>Last Updated</strong>
					<div>{new Date(cv.updatedAt).toLocaleDateString()}</div>
				</div>
				<div className="mb-3">
					<Button variant="primary"
						onClick={openPdfModal}
					>
						View PDF
					</Button>
					<CvPdfViewer cv={cv} show={showPdf} onHide={onHidePdf} />
				</div>
				<div className="mb-3">
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


export const CvPdfViewer = ({ cv, show, onHide }) => {
	const [pdfUrl, setPdfUrl] = useState(null)

	useEffect(() => {
		if (!show || !cv) return

		let url

		const loadPdf = async () => {
			try {
				const response = await api.get(
					`/cv/${cv._id}/file`,
					{ responseType: 'blob' }
				)

				url = URL.createObjectURL(response.data)
				setPdfUrl(url)
			} catch (error) {
				console.error('Failed to load CV:', error)
			}
		}

		loadPdf()

		return () => {
			if (url) {
				URL.revokeObjectURL(url)
			}

			setPdfUrl(null)
		}
	}, [cv, show])

	if (!cv) return null

	return (
		<Modal show={show} onHide={onHide} size="xl" centered>
			<Modal.Header closeButton>
				<Modal.Title>{cv.title}</Modal.Title>
			</Modal.Header>

			<Modal.Body className="p-0">
				{pdfUrl ? (
					<iframe
						src={pdfUrl}
						title={cv.title}
						width="100%"
						height="800"
						style={{ border: 0 }}
					/>
				) : (
					<div className="d-flex justify-content-center p-5">
						<Spinner />
					</div>
				)}
			</Modal.Body>
		</Modal>
	)
}

export { CvViewer }
