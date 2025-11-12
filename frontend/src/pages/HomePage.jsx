import React from 'react'
import {SignedOut, SignInButton, SignOutButton,SignedIn} from "@clerk/clerk-react"
import toast from "react-hot-toast";

export const HomePage = () => {
  return (
    <div>
        <button  className='btn btn-secondary' onClick={()=>{toast.success("This is a toast")}}>click me</button>
      <SignedOut>
        <SignInButton  mode="modal">
        <button className='btn btn-secondary'>Login</button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
       <SignOutButton>
       <button className='btn btn-secondary'>LogOut</button> 
        </SignOutButton>
      </SignedIn>
    </div>

  )
}
