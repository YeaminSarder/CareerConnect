import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

export default function ApplicationCard({
    application,
    onStatusChange,
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
                    onClick={() =>
                        onStatusChange(application)
                    }
                >
                    View
                </Button>
            </Card.Body>
        </Card>
    );
}