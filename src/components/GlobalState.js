import React, {useEffect,useState } from "react";
import { connect } from "react-redux";
import { selectAsset,unselectAsset,unselectAllAsset,addAnnotation,removeAnnotation,updateCurrentStreamState,updateUSDStorage,updateMSALInfo} from "../redux/reducer";
import SelectedAsset from "./SelectedAsset";
import AssetAnnotation from "./AssetAnnotation";
import EmbedPowerBI from "./EmbedPowerBI"
import Window from "../kit-app-streaming/Window";


const mapStateToProps = (state) => {
  return {
    state: state,
  };
};  

const mapDispatchToProps = (dispatch) => {
  return {
    selectAsset: (obj) => dispatch(selectAsset(obj)),
    unselectAsset: (obj) => dispatch(unselectAsset(obj)),
    unselectAllAsset: (obj) => dispatch(unselectAllAsset(obj)),
    addAnnotation: (obj) => dispatch(addAnnotation(obj)),
    removeAnnotation: (obj) => dispatch(removeAnnotation(obj)),
    updateCurrentStreamState: (obj) => dispatch(updateCurrentStreamState(obj)),
    updateUSDStorage: (obj) => dispatch(updateUSDStorage(obj)),
    updateMSALInfo: (obj) => dispatch(updateMSALInfo(obj))
  };
};

const GlobalState = (props) => {

  const selectAsset = (asset) => {
    props.selectAsset(asset);
  };


  const unselectAsset = (asset) => {
    props.unselectAsset(asset);
  };

  const unselectAllAsset = () => {
    props.unselectAllAsset();
  };

  const addAnnotation = (asset) => {
    props.addAnnotation(asset);
  };

  const updateCurrentStreamState = (asset) => {
    props.updateCurrentStreamState(asset);
  };

  const updateUSDStorage = (asset) => {
    props.updateUSDStorage(asset);
  };


  useEffect(() => {
      updateUSDStorage({
        "url": "http://storage...",
        "sasToken": "sas token..."
      })


    },[]);

  return (
    <div>

      Global State:
   
      <br />
      <button onClick={() => selectAsset("asset1")}>Select asset1</button>
      <button onClick={() => selectAsset("asset2")}>Select asset2</button>
      <button onClick={() => selectAsset("asset3")}>Select asset3</button>
      <br />

      <ul>
          {props.state.selectedAssetIds.length > 0
            ? props.state.selectedAssetIds.map((item) => {
                return (
                  <SelectedAsset
                    item={item}
                    unselectAsset={unselectAsset}
                  />
                );
              })
            : null}
      </ul>
      
      <br/><br/>
      <h2>Power BI Embedded</h2>

        <EmbedPowerBI
          selectAsset = {selectAsset}
          unselectAllAsset = {unselectAllAsset}
          selectedAssetIds = {props.state.selectedAssetIds}
          powerBIVisualName = '73f376c3cf388d22d921'
          powerBIVisualReportId = '6e9ad4fb-4e8a-4a92-bfa4-95c4198e88ae'
          powerBIVisualReportEmbedURL = 'https://app.powerbi.com/reportEmbed?reportId=6e9ad4fb-4e8a-4a92-bfa4-95c4198e88ae&ctid=d2e5ac16-7068-4b2d-995b-3924af59cc7a'
        />

        <h2>Kit App Streaming</h2>
        <div className="border-div">
          <Window/>
        </div>

        <h2>AIO</h2>
        <div className="border-div"></div>

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
              
      </div>
    );
  };

export default connect(mapStateToProps, mapDispatchToProps)(GlobalState);
