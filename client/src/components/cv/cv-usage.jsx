import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Badge from 'react-bootstrap/Badge'
import Spinner from 'react-bootstrap/Spinner'

import { useCvUsage } from '../../hooks/use-cv'

export const CvUsage = ({ cvId }) => {
    const {
        data: applications = [],
        isLoading,
        isError
    } = useCvUsage(cvId)

    if (isLoading) {
        return <Spinner animation="border" size="sm" />
    }

    if (isError) {
        return (
            <Card>
                <Card.Body>
                    Unable to load CV usage.
                </Card.Body>
            </Card>
        )
    }

    return (
        <Card>
            <Card.Header>
                <strong>Used for Applications</strong>
            </Card.Header>

            {applications.length === 0 ? (
                <Card.Body className="text-muted">
                    This CV hasn't been used for any applications yet.
                </Card.Body>
            ) : (
                <ListGroup variant="flush">
                    {applications.map(application => (
                        <ListGroup.Item
                            key={application._id}
                            className="d-flex align-items-center"
                        >
                            <div>
                                <div className="fw-semibold">
                                    {application.internship.title}
                                </div>

                                <div className="text-muted small">
                                    {application.internship.company}
                                    {' . '}
                                    Applied {' '}
                                    {new Date(application.appliedAt).toLocaleDateString()}
                                </div>
                            </div>

                            <Badge bg="secondary" className="ms-auto">
                                {application.status}
                            </Badge>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </Card>
    )
}

