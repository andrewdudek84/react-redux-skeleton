import React, { useState } from "react";
import { connect } from "react-redux";
import { selectAsset,unselectAsset,addAnnotation,removeAnnotation,updateCurrentStreamState,updateUSDStorageURL,updateUSDStorageToken} from "../redux/reducer";
import SelectedAsset from "./SelectedAsset";
import AssetAnnotation from "./AssetAnnotation";

const mapStateToProps = (state) => {
  return {
    state: state,
  };
};  

const mapDispatchToProps = (dispatch) => {
  return {
    selectAsset: (obj) => dispatch(selectAsset(obj)),
    unselectAsset: (obj) => dispatch(unselectAsset(obj)),
    addAnnotation: (obj) => dispatch(addAnnotation(obj)),
    removeAnnotation: (obj) => dispatch(removeAnnotation(obj)),
    updateCurrentStreamState: (obj) => dispatch(updateCurrentStreamState(obj)),
    updateUSDStorageURL: (obj) => dispatch(updateUSDStorageURL(obj)),
    updateUSDStorageToken: (obj) => dispatch(updateUSDStorageToken(obj))
  };
};

const GlobalState = (props) => {

  const selectAsset = (asset) => {
    props.selectAsset(asset);
  };

  const addAnnotation = (asset) => {
    props.addAnnotation(asset);
  };

  const updateCurrentStreamState = (asset) => {
    props.updateCurrentStreamState(asset);
  };

  const updateUSDStorageURL = (asset) => {
    props.updateUSDStorageURL(asset);
  };

  const updateUSDStorageToken = (asset) => {
    props.updateUSDStorageToken(asset);
  };

  const handleChangeUpdateUSDStorageURL = (e) => {
    props.updateUSDStorageURL(e.target.value)
  };

  const handleChangeUpdateUSDStorageToken = (e) => {
    props.updateUSDStorageToken(e.target.value)
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
                    <SelectedAsset
                      item={item}
                      unselectAsset={props.unselectAsset}
                    />
                  );
                })
              : null}
        </ul>
        <br />

        <button onClick={() => addAnnotation({
            "id":1,
            "asset":"asset1",
            "status":"warning",
            "state":"on",
            "message":"something is wrong with this machine.",
            "icon":""
        })}>Add warning to asset1</button>


      <button onClick={() => addAnnotation({
            "id":2,
            "asset":"asset2",
            "status":"warning",
            "state":"on",
            "message":"something is wrong with this machine.",
            "icon":""
        })}>Add warning to asset2</button>

        <br />

        <ul>
            {props.state.assetAnnotations.length > 0
              ? props.state.assetAnnotations.map((item) => {
                  return (
                    <AssetAnnotation
                      item={item}
                      removeAnnotation={props.removeAnnotation}
                    />
                  );
                })
              : null}
        </ul>

        <br/>

        <button onClick={() => updateCurrentStreamState({
            "state":"streaming",
            "message":""
        })}>Update Current Streaming State to Stremaing</button>

        <br/>
        <br/>
        <input className="" type='text' value={props.state.USDStorageURL} onChange={handleChangeUpdateUSDStorageURL}></input>
        
        <br/>
        <br/>
        <input type='text' value={props.state.USDStorageToken} onChange={handleChangeUpdateUSDStorageToken}></input>
      
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(GlobalState);
