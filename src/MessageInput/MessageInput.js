import { useEffect, useRef, useState } from 'react';
import { observer } from "mobx-react";
import './MessageInput.scss';

function MessageInput(props) {
  const { value, prediction, placeholder, onChange, onKeyDown, fetchAutoComplete } = props;
  let predictionText = prediction === '' ? value : prediction;
  if (value !== '' && value.charAt(value.length - 1) === '\n') {
    predictionText += ' ';
  }

  const ref = useRef();
  const [ rows, setRows ] = useState(1);
  useEffect(() => {
    if (ref && ref.current) {
      if (ref.current.scrollHeight > 17) {
        setRows(ref.current.scrollHeight / 17);
      } else {
        setRows(1);
      }
    }
  }, [value, prediction]);

  let timeout = useRef();
  useEffect(() => {
    if (value !== '') {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        fetchAutoComplete(value);
      }, 1000);
    } else {
      clearTimeout(timeout.current);
    }
  }, [value, fetchAutoComplete]);

  return (
    <div className="MessageInput">
      <div className="MessageInput__suggestion" ref={ref}>{predictionText}</div>
      <textarea
        className="MessageInput__input"
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}

export default observer(MessageInput);
