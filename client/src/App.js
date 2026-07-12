import { BrowserRouter, Routes, Route } from 'react-router-dom' 

import Home from './pages/home'
import Navbar from './components/navbar'
import Profile from './pages/profile'
import Register from './pages/register'
import Login from './pages/login'

function App() {
  return (
    <div className="App">
	  <BrowserRouter>
        <Navbar/>
		    <Routes>
          <Route
            path='/'
            element={<Home/>}
          />
          <Route
            path='/profile'
            element={<Profile/>}
          />
          <Route
            path='/register'
            element={<Register/>}
          />
          <Route
            path='/login'
            element={<Login/>}
          />
        </Routes>
	  </BrowserRouter>
    </div>
  );
}

export default App;
