import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

export default function ApplicationCard({
    application,
    onStatusChange,
    handleWithdrawApplication,
}) {
    const { internship } = application;

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
                    onClick={() => alert("not implemented yet")}
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
            </Card.Body>
        </Card>
    );
}