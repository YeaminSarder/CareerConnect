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
import InterviewsPage from './pages/interviews'
import EndorsementsPage from './pages/endorsements'
import { CvEdit } from './pages/cv-edit'
import { useAuthContext } from './hooks/use-auth-context'
import { Navigate } from 'react-router'
import { Loading } from './components/loading'
function App() {
  const { user, isLoading } = useAuthContext()
  return (
    <div className="App">
	  <BrowserRouter>
        <Navbar/>
	    <Routes>
          <Route
            path='/'
            element={isLoading? <Loading/>: user ? <Home /> : <Navigate to="/login" /> }
          />
          <Route
            path='/cv'
            element={isLoading ? <Loading/>: user ? <Cv /> : <Navigate to="/login" /> }
          />
          <Route
            path='/profile'
            element={isLoading? <Loading/>: user ? <Profile /> : <Navigate to="/login" /> }
          />
          <Route
            path='/internships'
            element={isLoading ? <Loading/> : user ? <InternshipsPage /> : <Navigate to="/login" /> }
          />
          <Route
            path='/connections'
            element={isLoading ? <Loading/> : user ? <ConnectionsPage /> : <Navigate to="/login" /> }
          />
          <Route
            path='/analytics'
            element={isLoading ? <Loading/> : user ? <AnalyticsPage /> : <Navigate to="/login" /> }
          />
          <Route
            path='/interviews-schedule'
            element={isLoading ? <Loading/> : user ? <InterviewsPage /> : <Navigate to="/login" /> }
          />
          <Route
            path='/endorsements'
            element={isLoading ? <Loading/> : user ? <EndorsementsPage /> : <Navigate to="/login" /> }
          />
          <Route
            path='/register'
            element={isLoading? <Loading/>: !user ? <Register /> : <Navigate to="/profile" /> }
          />
          <Route
            path='/login'
            element={isLoading? <Loading/>: !user ? <Login /> : <Navigate to="/profile" /> }
          />
          <Route
            path='/cv/edit/:cvId'
            element={isLoading? <Loading/>: user ? <CvEdit/> : <Navigate to="/login" /> }
          />
        </Routes>
	  </BrowserRouter>
    </div>
  );
}

export default App;
