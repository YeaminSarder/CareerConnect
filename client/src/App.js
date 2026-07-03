import { BrowserRouter, Routes, Route } from 'react-router-dom' 

import Home from './pages/home'
import Navbar from './components/navbar'
import Profile from './pages/profile'

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
        </Routes>
	  </BrowserRouter>
    </div>
  );
}

export default App;
