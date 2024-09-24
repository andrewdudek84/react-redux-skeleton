import React, { useState } from "react";
import { connect } from "react-redux";
import { selectAsset,unselectAsset } from "../redux/reducer";
import Message from "./SelectedAsset";

const mapStateToProps = (state) => {
  return {
    state: state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    selectAsset: (obj) => dispatch(selectAsset(obj)),
    unselectAsset: (obj) => dispatch(unselectAsset(obj))
  };
};

const GlobalState = (props) => {

  const selectAsset = (asset) => {
    props.selectAsset(asset);
  };

  return (
    <div>
      Global State:
      <span>{JSON.stringify(props.state)}</span>
      
      <br />
      <button onClick={() => selectAsset("asset1")}>Select asset1</button>
      <button onClick={() => selectAsset("asset2")}>Select asset2</button>
      <button onClick={() => selectAsset("asset3")}>Select asset3</button>
      <br />

        <ul>
            {props.state.selectedAssets.length > 0
              ? props.state.selectedAssets.map((item) => {
                  return (
                    <Message
                      item={item}
                      unselectAsset={props.unselectAsset}
                    />
                  );
                })
              : null}
        </ul>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(GlobalState);
