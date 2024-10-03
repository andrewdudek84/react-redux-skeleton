import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { selectAsset, unselectAsset, unselectAllAsset, addAnnotation, removeAnnotation, updateCurrentStreamState, updateUSDStorage, updateMSALInfo } from "../redux/reducer";
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
  }, []);


  return (
    <div>
      <EmbedPowerBI
        selectAsset={selectAsset}
        unselectAllAsset={unselectAllAsset}
        selectedAssetIds={props.state.selectedAssetIds}
        powerBIVisualName='73f376c3cf388d22d921'
        powerBIVisualReportId='a3c5c989-ed58-4737-bb2a-67ee7a74385f'
        powerBIVisualReportEmbedURL='https://app.powerbi.com/reportEmbed?reportId=a3c5c989-ed58-4737-bb2a-67ee7a74385f&ctid=d2e5ac16-7068-4b2d-995b-3924af59cc7a'
      />
       <div className="streaming-div">
        <Window
        unselectAsset={unselectAsset}
        selectAsset={selectAsset}
        unselectAllAsset={unselectAllAsset}
        selectedAssetIds={props.state.selectedAssetIds} />
      </div>

     
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(GlobalState);
