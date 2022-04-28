import React, { useRef, useState } from "react";

import { doc, getDoc, updateDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import "./conversation.css";

export default function Conversation({ receiver, user }) {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  var [lastmessageencrypted,setlastmessageencrypted] = useState("");
  var [lastmessagedecrypted,setlastmessagedecrypted] = useState("");
  var [messagesent,setmessagesent] = useState("");
  var [messageencrypted,setMessageencrypted] = useState("");
  const secretkey = "secret key 123";

  const currentMessage = useRef(null);

  var CryptoJS = require("crypto-js");

  // handle sending the messages
  const sendMessage = async () => {
    if (!currentMessage.current.value) return;

    console.log("Message sent is: ",currentMessage.current.value);
    messagesent = currentMessage.current.value;
    setmessagesent(messagesent);
    
    // Encrypt
    var ciphertext = CryptoJS.AES.encrypt(currentMessage.current.value, 'secret key 123').toString();
    messageencrypted = ciphertext;
    console.log("Message encrypted as",messageencrypted);
    setMessageencrypted(messageencrypted);

    const myMessage = {

      message: ciphertext,
      uid: user.uid,
    };
    
    // add and save message to firestore
    const conversationRef = doc(db, "conversations", conversationId);
    const docSnap = await getDoc(conversationRef);

    // append message to existing conversation
    if (docSnap.exists()) {
      const docData = docSnap.data();
      await updateDoc(conversationRef, {
        messages: [...docData.messages, myMessage],
      });

      
    } else {
      // create a new conversation
      await setDoc(doc(db, "conversations", conversationId), {
        messages: [myMessage],
      });
    }

    ciphertext = "";
  };

  // set conversationId
  React.useEffect(() => {
    if (!receiver || !user) return;

    let myConvId;

    if (receiver.uid > user.uid) myConvId = receiver.uid + user.uid;
    else myConvId = user.uid + receiver.uid;

    setConversationId(myConvId);
  }, [receiver, user]);

  // get converastion from firestore
  React.useEffect(() => {
    if (!conversationId) return;

    const unsub = onSnapshot(
      doc(db, "conversations", conversationId),
      (doc) => {
        const currentData = doc.data();

        if (currentData?.messages.length > 0) {
          
          currentData.messages.forEach(element => {
            lastmessageencrypted = element.message;

            //Decryption
            var bytes  = CryptoJS.AES.decrypt(element.message, 'secret key 123');
            element.message = bytes.toString(CryptoJS.enc.Utf8);
            lastmessagedecrypted = bytes.toString(CryptoJS.enc.Utf8);
          });
          console.log("The encrypted message fetched is: " + lastmessageencrypted);
          setlastmessageencrypted(lastmessageencrypted);
          console.log("After decryption: " + lastmessagedecrypted);
          setlastmessagedecrypted(lastmessagedecrypted);
          setMessages(currentData.messages);
        }
        else setMessages([]);
      }
    );

    return unsub;
  }, [conversationId]);

  // send message with enter
  const handleEnterKeyPressDown = (e) => {
    if ((e.code === "Enter" || e.key === "Enter") && !e.shiftKey) {
      sendMessage();
      currentMessage.current.value = "";
    }
  };

  return (
    <div className="chatscreen">
      
      {receiver ? (
        <div className="chat">
          <p>Conversation with {receiver.email}</p>

          {/* Conversation messages */}
          <div className="conversation-messages">
            {messages.map((obj, i) => (
                <div key={i} className = "message-container" style={{justifyContent:obj.uid === user.uid && "flex-end"}}>
                  <div >{obj.message}</div>
                </div>
              ))}
          </div>

          {/* Input bar */}
            <div className="input-container">
                <div className="input-message">
                    <input placeholder="Enter message" ref={currentMessage}  onKeyPress={handleEnterKeyPressDown}/>
                </div>
            <button onClick={sendMessage} currentMessage="">Send</button>
          </div>
        </div>
      ) : (
        <div className="nochat">
          <p>Pick someone to talk to.</p>
        </div>
      )}

<div className="encryption-details">
        <div className='encryption-elements'>
          <form>
            Secret key:<br /> <input value={secretkey}></input><br/><br/>

            Sent message is:<br /> <input value={messagesent} onChange={(e) => setmessagesent(e.target.value)}/><br/><br/>

            Message encrypted as:<br /> <input value={messageencrypted} onChange={(e1) => setMessageencrypted(e1.target.value)} /><br/><br/>

            Incoming message is :<br /> <input value={lastmessageencrypted} onChange={(e2) => lastmessageencrypted(e2.target.value)} /><br/><br/>

            Message decrypted as:<br /> <input value={lastmessagedecrypted} onChange={(e3) => lastmessagedecrypted(e3.target.value)} /><br/><br/>
            </form>
          
        </div>
      </div>


    </div>
  );
}