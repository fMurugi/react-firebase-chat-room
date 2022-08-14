import logo from './logo.svg';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth'


import {useAuthState} from 'react-firebase-hooks/auth'
import { useCollectionData} from 'react-firebase-hooks/firestore'
import { useState ,useRef} from 'react';

firebase.initializeApp({
  apiKey: "AIzaSyByzZEsogdrctYdoohIt2egPSDJpbhcbDs",

  authDomain: "chatapp-23811.firebaseapp.com",

  projectId: "chatapp-23811",

  storageBucket: "chatapp-23811.appspot.com",

  messagingSenderId: "1085970006635",

  appId: "1:1085970006635:web:6e20f90c1f5bcf5c0b272e",

  measurementId: "G-P4G6RFT98W"

})


const auth =firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header >
      <h1>⚛️🔥💬</h1>
        <SignOut />
       
      </header>
      <section>
        {user ? <ChatRoom/> : <SignIn/>}
       </section>
    </div>
  );
}

function SignIn(){
  const signInWithGoogle = ()=>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
    <button onClick ={signInWithGoogle}>sign in with google</button>
  )
}

  function SignOut(){
      return auth.currentUser && (
        <button onClick ={()=>auth.signOut()}>Sign Out</button>
      )
  }

   function ChatRoom(){
    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(30);

    const [messages] = useCollectionData(query,{idField:'id'});

    const [formValue,setFormValue]=useState("");

    const dummy =useRef();

    const sendMessage = async(e) =>{
      e.preventDefault();

      const {uid,photoURL}=auth.currentUser;

      await messagesRef.add({
        text:formValue,
        createdAt:firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL
      })
      setFormValue("") // return the value of input to empty string
      dummy.current.scrollIntoView({behavour:'smooth'});
    }

    return( 
      <>
        <main>
        {messages && messages.map(msg=><ChatMessage key ={msg.id} message ={msg}/>)}
        <span ref = {dummy}></span>
      </main>

      <form onSubmit={sendMessage} >
        <input value={formValue} onChange={(e)=>setFormValue(e.target.value)}/>
        <button type='submit' disabled={!formValue}>send</button>
      </form>
      </>
      
    )
  }

  function ChatMessage(props){
    const {text,uid,photoURL} = props.message;

    const messageClass = uid ===auth.currentUser.uid ? 'sent' :'recieved';

    return(
      <div className={`message ${messageClass}`}>
        <img src={photoURL} alt =""></img>
        <p>{text}</p>
      </div>

   
    )
  
}

export default App;
