import { BrowserRouter, Routes, Route } from 'react-router' 

import Home from './pages/home'
import Cv from './pages/cv'
import Navbar from './components/navbar'
import Profile from './pages/profile'
import Register from './pages/register'
import Login from './pages/login'
import { useAuthContext } from './hooks/use-auth-context'
import { Navigate } from 'react-router'
function App() {
  const { user } = useAuthContext()
  return (
    <div className="App">
	  <BrowserRouter>
        <Navbar/>
		    <Routes>
          <Route
            path='/'
            element={user ? <Home /> : <Navigate to="/login" /> }
          />
          <Route
            path='/cv'
            element={user ? <Cv /> : <Navigate to="/login" /> }
          />
          <Route
            path='/profile'
            element={user ? <Profile /> : <Navigate to="/login" /> }
          />
          <Route
            path='/register'
            element={!user ? <Register /> : <Navigate to="/profile" /> }
          />
          <Route
            path='/login'
            element={!user ? <Login /> : <Navigate to="/profile" /> }
          />
        </Routes>
	  </BrowserRouter>
    </div>
  );
}

export default App;
