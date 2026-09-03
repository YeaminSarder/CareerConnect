import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {CvCard} from "./card";

export function CvGrid({
    cvs,
    onView,
    onEdit,
    onDelete,
    onSetPrimary
}) {
    return (
        <Row xs={1} md={2} lg={3} className="g-4">
            {cvs.map((cv) => (
                <Col key={cv._id}>
                    <CvCard
                        cv={cv}
                        onView={onView}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onSetPrimary={onSetPrimary}
                    />
                </Col>
            ))}
        </Row>
    );
}