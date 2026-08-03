import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

export function EmptyCv({ onCreate }) {
    return (
        <Card className="text-center p-5">
            <Card.Body>
                <h4>No CVs yet</h4>

                <p className="text-muted">
                    Create your first CV to get started.
                </p>

                <Button onClick={onCreate}>
                    Create CV
                </Button>
            </Card.Body>
        </Card>
    );
}