import { useEffect, useRef, useState } from 'react';
import { observer } from "mobx-react";
import phone from './iphone.png';
import square from './square.png';
import './CustomerPane.scss';

function CustomerPane(props) {
  const { conversation, sendMessage } = props;
  const [message, setMessage] = useState('');

  const bodyRef = useRef();
  useEffect(() => {
    if (bodyRef && bodyRef.current) {
      bodyRef.current.scroll({
        behavior: 'smooth',
        left: 0,
        top: bodyRef.current.scrollHeight
      });
    }
  }, [conversation]);

  return (
    <div className="CustomerPane">
      <img src={phone} alt="Customer" className="phone" />
      <div className="screen">
        <div className="header">
          <div className="square-container">
            <img src={square} alt="Square" className="square" />
          </div>
          <span className="square-text">Square</span>
        </div>
        <div className="body" ref={bodyRef}>
          <div className="body-content">
            {conversation.map((utterance, index) => {
              return (
                <div className={utterance.speaker === 'customer' ? 'utterance-user' : 'utterance-other'} key={index}>
                  {utterance.text}
                </div>
              )
            })}
          </div>
        </div>
        <div className="footer">
          <input
            className="input"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Text message"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                sendMessage(message, 'customer');
                setMessage('');
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default observer(CustomerPane);
