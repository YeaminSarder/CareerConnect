import { Link } from 'react-router-dom'
const Navbar = () =>  {
    return (
        <header>
          <div className="container">
            <Link to="/">
              <h1>Home</h1>
            </Link>
            <Link to="/profile">
              <h1>Profile</h1>
            </Link>
          </div>
        </header>
    )
}

export default Navbar
