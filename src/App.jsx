import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import About from './pages/About'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Header from './components/Header'
import PraviteRouter from './components/PraviteRouter'
import CreateListing from './pages/CreateListing'
import Edit from './pages/Edit.jsx'
import Listing from './pages/Listing.jsx'
import Search from './pages/Search.jsx'


function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<Signin />} />
        <Route path='/sign-up' element={<Signup />} />
        <Route path='/search' element={<Search />} />
        <Route path='/listing/:id' element={<Listing />} />
        <Route element={<PraviteRouter />} >
          <Route path='/profile' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route path='/edit/:id' element={<Edit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
