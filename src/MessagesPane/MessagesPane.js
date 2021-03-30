import { useRef, useState, useEffect } from 'react';
import { observer } from "mobx-react";
import sparkle from './sparkle.svg';
import './MessagesPane.scss';
import MessageInput from '../MessageInput/MessageInput';

function MessagesPane(props) {
  const { conversation, sendMessage, autoReply, autoComplete, fetchAutoComplete } = props;
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
  }, [conversation, autoReply]);

  return (
    <div className="MessagesPane">
      <div className="header">
        John Doe
      </div>
      <div className="body" ref={bodyRef}>
        <div className="body-content">
          {conversation.map((utterance, index) => {
            return (
              <div className={utterance.speaker === 'merchant' ? 'row-user' : 'row-other'} key={index}>
                {utterance.speaker === 'customer' ?
                  <div className="picture">
                    JD
                  </div>
                : null}
                <div className={utterance.speaker === 'merchant' ? 'utterance-user' : 'utterance-other'}>
                  {utterance.text}
                </div>
              </div>
            )
          })}
          {autoReply !== '' ?
          <div className="row-user">
            <div className="utterance-suggestion">
              <div className="utterance-suggestion-header">
                <img src={sparkle} alt="Suggestion" className="sparkle" />
                Smart Reply
              </div>
              {autoReply}
            </div>
            <div className="utterance-send-status">
              {'Not delivered. '}
              <span className="underline" onClick={() => sendMessage(autoReply, 'merchant')}>Send</span>
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
        <MessageInput
          value={message}
          prediction={message !== '' && autoComplete.startsWith(message) ? autoComplete : ''}
          fetchAutoComplete={fetchAutoComplete}
          placeholder="Send via text"
          onChange={e => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage(message, 'merchant');
              setMessage('');
            }
            if (e.key === 'Tab') {
              e.preventDefault();
              setMessage(autoComplete);
            }
          }}
        />
      </div>
    </div>
  );
}

export default observer(MessagesPane);
