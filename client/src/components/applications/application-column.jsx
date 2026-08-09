import Stack from "react-bootstrap/Stack";
import ApplicationCard from "./application-card";

export default function ApplicationColumn({
    status,
    applications,
    onStatusChange,
}) {
    return (
        <div
            className="bg-light rounded p-3"
            style={{
                minWidth: "300px",
                width: "300px",
            }}
        >
            <Stack direction="horizontal" className="mb-3">
                <h5 className="mb-0">{status}</h5>

                <span className="badge bg-secondary ms-auto">
                    {applications.length}
                </span>
            </Stack>

            <Stack gap={3}>
                {applications.map((application) => (
                    <ApplicationCard
                        key={application._id}
                        application={application}
                        onStatusChange={onStatusChange}
                    />
                ))}
            </Stack>
        </div>
    );
}