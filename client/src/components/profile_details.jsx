import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import useProfileContext from '../hooks/profile'
import { useAuthContext } from '../hooks/use-auth-context'
const ProfileDetails = ({profile}) => {
    const { dispatch } = useProfileContext()
    const { user } = useAuthContext()
    const handleClick = async () => {
      if (!user) {
        console.error('You must be logged in to delete a profile');
        return;
      }
        const response = await fetch(`/api/profile/${profile._id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
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