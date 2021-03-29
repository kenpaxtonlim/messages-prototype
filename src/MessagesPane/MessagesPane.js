import { useRef, useState, useEffect } from 'react';
import { observer } from "mobx-react";
import sparkle from './sparkle.svg';
import './MessagesPane.scss';

function MessagesPane(props) {
  const { conversation, sendMessage, suggestion, clearSuggestion } = props;
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
  useEffect(() => {
    if (message !== '') {
      clearSuggestion();
    }
  }, [message, clearSuggestion]);

  return (
    <div className="MessagesPane">
      <div className="header">
        John Doe
      </div>
      <div className="body" ref={bodyRef}>
        <div className="body-content">
          {conversation.map((utterance, index) => {
            return (
              <div className={utterance.speaker === 'merchant' ? 'row-user' : 'row-other'}>
                {utterance.speaker === 'customer' ?
                  <div className="picture">
                    JD
                  </div>
                : null}
                <div className={utterance.speaker === 'merchant' ? 'utterance-user' : 'utterance-other'} key={index}>
                  {utterance.text}
                </div>
              </div>
            )
          })}
          {suggestion !== '' ?
          <div className="row-user">
            <div className="utterance-suggestion">
              <div className="utterance-suggestion-header">
                <img src={sparkle} alt="Suggestion" className="sparkle" />
                Smart Reply
              </div>
              {suggestion}
            </div>
            <div className="utterance-send-status">
              {'Not delivered. '}
              <span className="underline" onClick={() => sendMessage(suggestion, 'merchant')}>Send</span>
            </div>
          </div>
        : null}
        </div>
      </div>
      <div className="footer">
        {/*suggestion !== '' ?
        <div className="suggestion-container">
          <div className="suggestion-header">
            <img src={sparkle} alt="Suggestion" className="sparkle" />
            Smart Reply
          </div>
          <div className="suggestion-body">
            {suggestion}
          </div>
          <div className="suggestion-footer">
            <div className="button" onClick={() => sendMessage(suggestion, 'merchant')}>Send</div>
          </div>
        </div>
        : null*/}
        <div className="input-container">
          <input
            className="input"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Send via text"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                sendMessage(message, 'merchant');
                setMessage('');
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default observer(MessagesPane);
