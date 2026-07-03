import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import useProfileContext from '../hooks/profile'
const ProfileDetails = ({profile}) => {
    const { dispatch } = useProfileContext()
    const handleClick = async () => {
        const response = await fetch(`/api/profile/${profile._id}`, {
            method: 'DELETE',
        });
        const json = await response.json();
        if (response.ok) {
            dispatch({ type: 'DELETE_PROFILE', payload: json });
        }
    };
  return (
    <Card style={{ width: '18rem', margin: '1rem' }}>
      <Card.Body className="d-flex justify-content-between align-items-center">
        <div>
        <Card.Title>{profile.name}</Card.Title>
        <Card.Text>
          <strong>Age:</strong> {profile.age}
        </Card.Text>
        </div>
        <Button variant="danger" onClick={handleClick}>
          Delete
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ProfileDetails;