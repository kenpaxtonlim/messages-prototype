import { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import phone from './iphone.png';
import square from './square.png';
import './CustomerPane.scss';
import EventCard from '../EventCard/EventCard';

function CustomerPane(props) {
  const { controller } = props;
  const { conversation, sendMessage } = controller;
  const [message, setMessage] = useState('');

  const bodyRef = useRef();
  useEffect(() => {
    if (bodyRef && bodyRef.current) {
      bodyRef.current.scroll({
        behavior: 'smooth',
        left: 0,
        top: bodyRef.current.scrollHeight,
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
              let content = null;
              if (utterance.metadata?.event === 'PHOTO') {
                content = (
                  <div className="utterance-user-photo">
                    <EventCard event={utterance.metadata.event} />
                  </div>
                );
              } else {
                content = (
                  <div
                    className={
                      utterance.speaker === 'customer'
                        ? 'utterance-user'
                        : 'utterance-other'
                    }
                    key={index}
                  >
                    {utterance.text}
                  </div>
                );
              }
              return content;
            })}
          </div>
        </div>
        <div className="footer">
          <input
            className="input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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
