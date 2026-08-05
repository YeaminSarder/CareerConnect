import { BrowserRouter, Routes, Route } from 'react-router' 

import Home from './pages/home'
import Cv from './pages/cv'
import Navbar from './components/navbar'
import Profile from './pages/profile'
import Register from './pages/register'
import Login from './pages/login'
import InternshipsPage from './pages/internships'
import ConnectionsPage from './pages/connections'
import AnalyticsPage from './pages/analytics'
import { CvEdit } from './pages/cv-edit'
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
            path='/internships'
            element={user ? <InternshipsPage /> : <Navigate to="/login" /> }
          />
          <Route
            path='/connections'
            element={user ? <ConnectionsPage /> : <Navigate to="/login" /> }
          />
          <Route
            path='/analytics'
            element={user ? <AnalyticsPage /> : <Navigate to="/login" /> }
          />
          <Route
            path='/register'
            element={!user ? <Register /> : <Navigate to="/profile" /> }
          />
          <Route
            path='/login'
            element={!user ? <Login /> : <Navigate to="/profile" /> }
          />
          <Route
            path='/cv/edit/:cvId'
            element={user ? <CvEdit/> : <Navigate to="/login" /> }
          />
        </Routes>
	  </BrowserRouter>
    </div>
  );
}

export default App;
