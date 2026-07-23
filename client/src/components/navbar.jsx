import { Link } from 'react-router-dom'
import { Navbar as RNavbar, Nav, Container, Button } from 'react-bootstrap'
import { useLogout } from '../hooks/use-logout'
import { useAuthContext } from '../hooks/use-auth-context'
const Navbar = () =>  {
    const { logout } = useLogout();
    const { user } = useAuthContext();
    return (
      
      <RNavbar expand="lg" bg="dark" variant="dark">
        <Container>
          
        <RNavbar.Brand href="/">
            <img
              alt=""
              src={`${process.env.PUBLIC_URL}/favicon.ico`}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}CareerConnect</RNavbar.Brand>
          <RNavbar.Toggle aria-controls="responsive-navbar-nav" />
          <RNavbar.Collapse id="responsive-navbar-nav">
              <Nav variant="pills" className="me-auto">
                <Nav.Item>
                  <Link to="/" className="nav-link">
                    Home
                  </Link>
                </Nav.Item>
                {user ? (
                  <Nav.Item>
                    <Link to="/profile" className="nav-link">
                      {user.name}
                    </Link>
                  </Nav.Item>
                ) : (
                  <>
                    <Nav.Item>
                      <Link to="/register" className="nav-link">
                        Register
                      </Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Link to="/login" className="nav-link">
                        Login
                      </Link>
                    </Nav.Item>
                  </>
                )}
                {user && (
                  <Nav.Item>
                    <Button variant="link" className='nav-link' onClick={() => {
                      logout(); 
                    }}>
                      Logout
                    </Button>
                  </Nav.Item>
                )}
              </Nav>
          </RNavbar.Collapse>
        </Container>
      </RNavbar>
    )
}

export default Navbar
