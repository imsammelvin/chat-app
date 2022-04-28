import { createUserWithEmailAndPassword } from '@firebase/auth';
import { addDoc, collection } from '@firebase/firestore';
import React,{useRef} from 'react'
import { useHistory } from 'react-router-dom';
import { db,auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import "./login-screen.css";

export default function LoginScreen({setUser}) {

  let history = useHistory();

  const email = useRef(null);
  const password = useRef(null);

  const register = async() => {
    const myEmail = email.current.value;
    const myPassword = password.current.value;

    try {
        const responseFromAuth = await createUserWithEmailAndPassword(
            auth,
            myEmail,
            myPassword
        );
        
        const userId = responseFromAuth.user.uid;

        await addDoc(collection(db,"users"),{
            email:myEmail,
            uid:userId,
        });

        localStorage.setItem(
            "user",
            JSON.stringify({
                email:myEmail,
                uid:userId
            })
        );

        setUser({
            email:myEmail,
            uid:userId
        });

        history.push('/chat');

    } catch (error) {
        console.log(error);
    }
  };

  const login = async() => {
    const myEmail = email.current.value;
    const myPassword = password.current.value;

    try {
        const responseFromAuth = await signInWithEmailAndPassword(
            auth,
            myEmail,
            myPassword
        );
        
        const userId = responseFromAuth.user.uid;


        localStorage.setItem(
            "user",
            JSON.stringify({
                email:myEmail,
                uid:userId
            })
        );

        setUser({
            email:myEmail,
            uid:userId
        });

        history.push('/chat');

    } catch (error) {
        console.log(error);
    }
  };

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    
    if(user){
        setUser(user);
        history.push('/chat');
    }
  },[history, setUser]);
    
  return (
    <div className='login-screen'>
        <div className='title'>
            <p>Login Screen</p><br />
        </div>

        <div className='mail'>
            <p>Email</p>
            <input ref={email}/>
        </div>

        <div className='password'>
            <p>Password</p>
            <input type = 'password' ref={password} />
        </div>
        <br /><br />

        <button onClick={register}>Register</button><br /><br />
        <button onClick={login}>Log in</button>
    </div>
  )
}
