import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import {useModal} from "../../hooks/use-modal"
import ApplicationViewer from "./application-viewer.jsx";

export default function ApplicationCard({
    application,
    onStatusChange,
    handleWithdrawApplication,
}) {
    const { internship } = application;
    const { show, onHide, openModal, closeModal } = useModal();
    return (
        <Card className="shadow-sm">
            <Card.Body>
                <Card.Title>
                    {internship.title}
                </Card.Title>

                <Card.Subtitle className="mb-2 text-muted">
                    {internship.company}
                </Card.Subtitle>

                <Card.Text className="small text-muted">
                    Applied{" "}
                    {new Date(
                        application.appliedAt
                    ).toLocaleDateString()}
                </Card.Text>

                <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => {
                        openModal()
                    }}
                >
                    View
                </Button>
                <Button
                    size="sm"
                    variant="outline-danger"
                    className="ms-2"
                    onClick={() => handleWithdrawApplication(application._id)}
                >
                    Withdraw
                </Button>
                <ApplicationViewer
                    application={application}
                    show={show}
                    onHide={onHide}
                />
            </Card.Body>
        </Card>
    );
}