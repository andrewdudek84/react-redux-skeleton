import React, { useState } from "react";
import { connect } from "react-redux";
import { addMessage,removeMessage } from "../redux/reducer";
import Message from "./Message";

const mapStateToProps = (state) => {
  return {
    messages: state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addMessage: (obj) => dispatch(addMessage(obj)),
    removeMessage: (id) => dispatch(removeMessage(id))
  };
};

const Messages = (props) => {
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const add = () => {
    if (message === "") {
      alert("Input is Empty");
    } else {
      props.addMessage({
        id: Math.floor(Math.random() * 1000),
        item: message,
        completed: false,
      });
      setMessage("");
    }
  };

  return (
    <div className="addMessage">
      <input
        type="text"
        onChange={(e) => handleChange(e)}
        className="message-input"
        value={message}
      />
      <button 
        onClick={() => add()}
      >Add Message
      </button>
      <br />

        <ul>
            {props.messages.length > 0
              ? props.messages.map((item) => {
                  return (
                    <Message
                      key={item.id}
                      item={item}
                      removeMessage={props.removeMessage}
                    />
                  );
                })
              : null}
        </ul>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
