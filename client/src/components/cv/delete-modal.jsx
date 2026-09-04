import { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { withdrawApplication } from '../../api/application'
import { useCvUsage, useDeleteCv } from '../../hooks/use-cv'

export const CvDeleteModal = ({ cv, show, onHide }) => {
    const {
        data: applications = [],
        isPending: loadingApplications,
        error: applicationsError,
        refetch
    } = useCvUsage(cv?._id)


    const {
        deleteCv,
        isPending: deleting,
        error: deleteError
    } = useDeleteCv()

    const [withdrawingId, setWithdrawingId] = useState(null)
    const [error, setError] = useState(null)

    if (!cv) return null

    const handleWithdraw = async (application) => {
        setWithdrawingId(application._id)
        setError(null)

        try {
            await withdrawApplication(application._id)
            await refetch()
        } catch (err) {
            console.error('Error withdrawing application:', err)
            setError(
                err.response?.data?.error ||
                err.message ||
                'Failed to withdraw application.'
            )
        } finally {
            setWithdrawingId(null)
        }
    }

    const handleDelete = async () => {
        if (applications.length > 0) return

        setError(null)

        try {
            await deleteCv(cv._id)
            onHide()
        } catch (err) {
            console.error('Error deleting CV:', err)
            setError(
                err.response?.data?.error ||
                err.message ||
                'Failed to delete CV.'
            )
        }
    }

    const displayError =
        error ||
        applicationsError?.response?.data?.error ||
        applicationsError?.message ||
        deleteError

    return (
        <Modal
            show={show}
            onHide={deleting ? undefined : onHide}
            centered
        >
            <Modal.Header closeButton={!deleting}>
                <Modal.Title>
                    <i className="bi bi-trash3 text-danger me-2"></i>
                    Delete CV
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="mb-3">
                    <div className="fw-bold">
                        {cv.title || 'Untitled CV'}
                    </div>

                    <div className="text-muted small">
                        Before deleting this CV, you must withdraw any
                        applications that use it.
                    </div>
                </div>

                {displayError && (
                    <div className="alert alert-danger small py-2">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        {displayError}
                    </div>
                )}

                {loadingApplications ? (
                    <div className="text-center py-4">
                        <div
                            className="spinner-border spinner-border-sm text-primary me-2"
                            role="status"
                        />
                        <span className="text-muted">
                            Checking applications...
                        </span>
                    </div>
                ) : applications.length > 0 ? (
                    <>
                        <div className="alert alert-warning small">
                            <i className="bi bi-info-circle-fill me-2"></i>
                            This CV is being used by{' '}
                            <strong>{applications.length}</strong>{' '}
                            application
                            {applications.length !== 1 ? 's' : ''}.
                            Withdraw them before deleting this CV.
                        </div>

                        <div className="list-group">
                            {applications.map((application) => {
                                const isWithdrawing =
                                    withdrawingId === application._id

                                return (
                                    <div
                                        key={application._id}
                                        className="list-group-item"
                                    >
                                        <div className="d-flex justify-content-between align-items-center gap-3">
                                            <div>
                                                <div className="fw-semibold">
                                                    {application.internship?.title ||
                                                        'Unknown internship'}
                                                </div>

                                                <div className="text-muted small">
                                                    {application.internship?.company ||
                                                        'Unknown company'}
                                                </div>

                                                <span className="badge text-bg-secondary mt-1">
                                                    {application.status}
                                                </span>
                                            </div>

                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                disabled={
                                                    isWithdrawing || deleting
                                                }
                                                onClick={() =>
                                                    handleWithdraw(
                                                        application
                                                    )
                                                }
                                            >
                                                {isWithdrawing ? (
                                                    <>
                                                        <span
                                                            className="spinner-border spinner-border-sm me-1"
                                                            role="status"
                                                        />
                                                        Withdrawing
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-x-lg me-1"></i>
                                                        Withdraw
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                ) : (
                    <div className="alert alert-success small mb-0">
                        <i className="bi bi-check-circle-fill me-2"></i>
                        No applications are using this CV. It is safe to
                        delete.
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onHide}
                    disabled={deleting}
                >
                    Cancel
                </button>

                <button
                    type="button"
                    className="btn btn-danger"
                    disabled={
                        loadingApplications ||
                        applications.length > 0 ||
                        deleting
                    }
                    onClick={handleDelete}
                >
                    {deleting ? (
                        <>
                            <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                            />
                            Deleting...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-trash3 me-2"></i>
                            Delete CV
                        </>
                    )}
                </button>
            </Modal.Footer>
        </Modal>
    )

}

export default CvDeleteModal
