import { useEffect, useRef, useState } from 'react';
import { observer } from "mobx-react";
import './MessageInput.scss';

function MessageInput(props) {
  const { value, suggestionValue, placeholder, onChange, onKeyDown } = props;
  let suggestion = suggestionValue === '' ? value : suggestionValue;
  if (value.charAt(value.length - 1) === '\n') {
    suggestion += ' ';
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
  }, [value, suggestionValue]);

  return (
    <div className="MessageInput">
      <div className="MessageInput__suggestion" ref={ref}>{suggestion}</div>
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
