import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";

export function CvCard({
    cv,
    onView,
    onEdit,
    onDelete,
}) {
    return (
        <Card className="shadow-sm h-100">
            <Card.Body>
                <Stack
                    direction="horizontal"
                    className="mb-3"
                >
                    <div>
                        <Card.Title>{cv.title}</Card.Title>

                        <Card.Subtitle className="text-muted">
                            {new Date(cv.updatedAt).toLocaleDateString()}
                        </Card.Subtitle>
                    </div>

                    <div className="ms-auto">
                        {cv.isPublic && (
                            <span className="badge bg-success">
                                Public
                            </span>
                        )}
                    </div>
                </Stack>

                <Card.Text className="text-muted">
                    {cv.summary || "No summary"}
                </Card.Text>

                <Stack direction="horizontal" gap={2}>
                    <Button
                        variant="primary"
                        onClick={() => onView(cv)}
                    >
                        View
                    </Button>

                    <Button
                        variant="outline-secondary"
                        onClick={() => onEdit(cv)}
                    >
                        Edit
                    </Button>

                    <Button
                        className="ms-auto"
                        variant="outline-danger"
                        onClick={() => onDelete(cv)}
                    >
                        Delete
                    </Button>
                </Stack>
            </Card.Body>
        </Card>
    );
}