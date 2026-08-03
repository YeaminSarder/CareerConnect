import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";

export function CvHeader({ onCreate }) {
    return (
        <Stack
            direction="horizontal"
            className="mb-4"
        >
            <div>
                <h2 className="mb-0">My CVs</h2>
                <small className="text-muted">
                    Manage all of your resumes
                </small>
            </div>

            <Button
                className="ms-auto"
                onClick={onCreate}
            >
                + New CV
            </Button>
        </Stack>
    );
}