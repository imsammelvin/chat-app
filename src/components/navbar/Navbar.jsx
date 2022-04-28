import React from 'react'
import { useHistory } from 'react-router-dom';
import "./navbar.css";

export default function Navbar({ user, setUser}) {

let history = useHistory();

const logout = () => {
  localStorage.setItem("user",null);
  setUser(null);
  history.push("/");
}

  return (
    <div className='navbar-container'>
        {user ? (
        <div>
          <p>Welcome, {user.email}</p>
          <p onClick={logout}>Log out</p>
        </div>
         ) : (
        <div>
          <p>Login to use chat.</p>
        </div>
         )}
    </div>
 )
}
