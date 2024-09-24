import React, { useRef } from "react";

const SelectedAsset = (props) => {
  const { item,  unselectAsset } = props;

  const inputRef = useRef(true);


  return (
    <div class="message-div" key={item}>
      <button onClick={() => unselectAsset(item)}>Unselect {item}</button>
    </div>
  );
};

export default SelectedAsset;
