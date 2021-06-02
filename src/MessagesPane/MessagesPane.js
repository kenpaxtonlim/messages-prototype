import { useRef, useState, useEffect } from 'react';
import { observer } from "mobx-react";
import './MessagesPane.scss';
import MessageInput from '../MessageInput/MessageInput';
import AppointmentIcon from '../svg/AppointmentIcon';
import InvoiceIcon from '../svg/InvoiceIcon';
import PaymentIcon from '../svg/PaymentIcon';
import PhotoIcon from '../svg/PhotoIcon';
import RefundIcon from '../svg/RefundIcon';

function MessagesPane(props) {
  const {
    conversation,
    sendMessage,
    autoReply,
    autoComplete,
    fetchAutoComplete,
    clearAutoComplete,
    suggestedActions,
    clearSuggestedActions,
  } = props;
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
  }, [bodyRef, conversation, autoReply, suggestedActions]);

  let suggestionHeading = '';
  if (autoReply && suggestedActions.length === 0) {
    suggestionHeading = 'Suggested Reply';
  } else if ((autoReply && suggestedActions.length > 0) || suggestedActions.length > 1) {
    suggestionHeading = 'Suggested Actions';
  } else if (suggestedActions.length === 1) {
    suggestionHeading = 'Suggested Action';
  }

  let suggestionComponent = null;
  if (autoReply || suggestedActions) {
    let suggestions = [];
    suggestedActions.forEach((suggestion, index) => {
      switch (suggestion) {
        case 'Request Payment':
          suggestions.push(
            <div className="utterance-suggestion" key={index}>
              <div
                className="utterance-suggestion-content"
                onClick={() => {
                  clearSuggestedActions();
                }}
              >
                <div className="suggestion-icon">
                  <PaymentIcon />
                </div>
                {suggestion}
              </div>
            </div>
          )
          break;
        case 'Send Invoice':
          suggestions.push(
            <div className="utterance-suggestion" key={index}>
              <div
                className="utterance-suggestion-content"
                onClick={() => {
                  clearSuggestedActions();
                }}
              >
                <div className="suggestion-icon">
                  <InvoiceIcon />
                </div>
                {suggestion}
              </div>
            </div>
          )
          break;
        case 'Issue Refund':
          suggestions.push(
            <div className="utterance-suggestion" key={index}>
              <div
                className="utterance-suggestion-content"
                onClick={() => {
                  clearSuggestedActions();
                }}
              >
                <div className="suggestion-icon">
                  <RefundIcon />
                </div>
                {suggestion}
              </div>
            </div>
          )
          break;
        case 'Send Photo':
          suggestions.push(
            <div className="utterance-suggestion" key={index}>
              <div
                className="utterance-suggestion-content"
                onClick={() => {
                  clearSuggestedActions();
                }}
              >
                <div className="suggestion-icon">
                  <PhotoIcon />
                </div>
                {suggestion}
              </div>
            </div>
          )
          break;
        case 'Send Booking Site':
          suggestions.push(
            <div className="utterance-suggestion" key={index}>
              <div
                className="utterance-suggestion-content"
                onClick={() => {
                  clearSuggestedActions();
                }}
              >
                <div className="suggestion-icon">
                  <AppointmentIcon />
                </div>
                {suggestion}
              </div>
            </div>
          )
          break;
          case 'Create Appointment':
          suggestions.push(
            <div className="utterance-suggestion" key={index}>
              <div
                className="utterance-suggestion-content"
                onClick={() => {
                  clearSuggestedActions();
                }}
              >
                <div className="suggestion-icon">
                  <AppointmentIcon />
                </div>
                {suggestion}
              </div>
            </div>
          )
          break;
        default:
      }
    });
    if (autoReply) {
      suggestions.push(
        <div className="utterance-suggestion" key="autoreply">
          <div
            className="utterance-suggestion-content"
            onClick={() => {
              setMessage(autoReply);
              clearSuggestedActions();
            }}
            title="Click to edit"
          >
            {autoReply}
          </div>
        </div>
      )
    }

    suggestionComponent = (
      <div className="row-user row-suggestion">
        <div className="row-suggestion-heading">
          {suggestionHeading}
        </div>
        {suggestions}
      </div>
    );
  }

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
          {suggestionComponent}
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
            if (e.key === 'Backspace') {
              clearAutoComplete();
              if (message === '') {
                clearSuggestedActions();
              }
            }
          }}
        />
      </div>
    </div>
  );
}

export default observer(MessagesPane);
