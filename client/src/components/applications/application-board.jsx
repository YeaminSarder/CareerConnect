import ApplicationColumn from "./application-column";

const columns = [
    "Applied",
    "Under Review",
    "Shortlisted",
    "Interviewing",
    "Accepted",
    "Rejected",
];

export default function ApplicationBoard({
    applications,
    onStatusChange,
    handleWithdrawApplication,
}) {
    return (
        <div className="d-flex gap-3 overflow-auto pb-3">
            {columns.map((status) => (
                <ApplicationColumn
                    key={status}
                    status={status}
                    applications={applications.filter(
                        (application) =>
                            application.status === status
                    )}
                    onStatusChange={onStatusChange}
                    handleWithdrawApplication={handleWithdrawApplication}
                />
            ))}
        </div>
    );
}