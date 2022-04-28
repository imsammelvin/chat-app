import React from 'react'
import "./chatheads.css";

export default function ChatHeads({items, setreceiver}) {
  return (
    <div>
        <p>Chatheads</p>
        {items.map((obj, i) => (
            <div key={i} className ="chat-head-item" onClick={() => setreceiver(obj)}>
                <div className='user-profile-pic'>
                    <p className='user-profile-pic-text'>{obj.email[0]}</p>
                </div>
                <p>{obj.email}</p>
            </div>
        ))}
    </div>
  );
}
