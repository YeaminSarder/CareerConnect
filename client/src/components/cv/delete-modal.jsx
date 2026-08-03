import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export function DeleteCvModal({
    show,
    cv,
    onCancel,
    onConfirm,
}) {
    return (
        <Modal show={show} onHide={onCancel}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Delete CV
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                Are you sure you want to delete
                <strong> {cv?.title}</strong>?
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={onCancel}
                >
                    Cancel
                </Button>

                <Button
                    variant="danger"
                    onClick={onConfirm}
                >
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
}