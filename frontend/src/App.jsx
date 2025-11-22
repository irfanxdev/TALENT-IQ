
// import reactLogo from './assets/react.svg'
import { HomePage } from './pages/HomePage';
import {Routes,Route, Navigate}  from "react-router-dom";
import { useUser } from '@clerk/clerk-react';
import { ProblemsPage } from './pages/ProblemsPage';
import { Toaster } from 'react-hot-toast';
import DashboardPage from "./pages/DashboardPage";
import ProblemPage from './pages/ProblemPage.jsx';

function App() {
  
  //  this is used to check the user is login or not if not then navigate to the home page 
  const {isSignedIn,isLoaded}=useUser();

  // this is get rid of the flickering effect
  if(!isLoaded) return null;
  return (
   <>
    <Routes>
      <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
      <Route path="/dashboard" element={isSignedIn?< DashboardPage/>:<Navigate to={"/"}/>}/>

      <Route path='/problems' element={isSignedIn?<ProblemsPage/>:<Navigate to={"/"}/>}/>
       <Route path='/problem/:id' element={isSignedIn?<ProblemPage/>:<Navigate to={"/"}/>}/>
    </Routes>
    <Toaster position='top-center' toastOptions={{duration:3000}}/>
  </>
  )
}

export default App

//todo: react-query transtack query,axios 