import { Link } from 'react-router-dom'
import { Navbar as RNavbar, Nav, Container } from 'react-bootstrap'
const Navbar = () =>  {
    return (
      
      <RNavbar expand="lg" bg="dark" variant="dark">
        <Container>
          
        <RNavbar.Brand href="/">CareerConnect</RNavbar.Brand>
          <RNavbar.Toggle aria-controls="responsive-navbar-nav" />
          <RNavbar.Collapse id="responsive-navbar-nav">
              <Nav variant="pills" className="me-auto">
                <Nav.Item>
                  <Link to="/" className="nav-link">
                    Home
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link to="/profile" className="nav-link">
                    Profile
                  </Link>
                </Nav.Item>
              </Nav>
          </RNavbar.Collapse>
        </Container>
      </RNavbar>
    )
}

export default Navbar
