import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import useProfileContext from '../hooks/profile';
const ProfileForm = () => {
  const { dispatch } = useProfileContext();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProfile = { name, age };
    const response = await fetch(`/api/profile/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProfile),
    });
    if (!response.ok) {
      const errorData = await response.json();
      setError(errorData.error);
    } else {
      setError(null);
      setName('');
      setAge('');
      const newProfile = await response.json();
      dispatch({ type: 'CREATE_PROFILE', payload: newProfile });
      console.log('Profile added successfully', newProfile);
    }
  };

  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
    {error && <p style={{ color: 'red' }}>{error}</p>}
      <Form.Group>
        <Form.Label>Name:</Form.Label>
        <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Age:</Form.Label>
        <Form.Control type="number" value={age} onChange={(e) => setAge(e.target.value)} />
      </Form.Group>
      <Button type="submit" variant="primary" style={{ marginTop: '1rem' }}>
        Add Profile
      </Button>
    </Form>
  );
};

export default ProfileForm;