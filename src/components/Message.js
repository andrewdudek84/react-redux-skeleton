import React, { useRef } from "react";

const Message = (props) => {
  const { item,  removeMessage } = props;

  const inputRef = useRef(true);

  const changeFocus = () => {
    inputRef.current.disabled = false;
    inputRef.current.focus();
  };

  return (
    <div class="message-div" key={item.id}>
      <span>{item.item}</span>
      <br/>
      <button onClick={() => removeMessage(item.id)}>Remove Message</button>
    </div>
  );
};

export default Message;
