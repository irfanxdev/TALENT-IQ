
// import reactLogo from './assets/react.svg'
import { useUser } from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import { HomePage } from './pages/HomePage';
import ProblemPage from './pages/ProblemPage.jsx';
import { ProblemsPage } from './pages/ProblemsPage';
import SessionPage from './pages/SessionPage.jsx';

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
       <Route path='/session/:id' element={isSignedIn?<SessionPage/> : <Navigate to={"/"}/>}/>
    </Routes>
    <Toaster position='top-center' toastOptions={{duration:3000}}/>
  </>
  )
}

export default App

//todo: react-query transtack query,axios 