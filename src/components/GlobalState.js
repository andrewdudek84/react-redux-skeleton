import React, {useEffect,useState } from "react";
import { useMsal } from '@azure/msal-react';
import { connect } from "react-redux";
import { selectAsset,unselectAsset,addAnnotation,removeAnnotation,updateCurrentStreamState,updateUSDStorage,updateMSALInfo} from "../redux/reducer";
import SelectedAsset from "./SelectedAsset";
import AssetAnnotation from "./AssetAnnotation";

import { models } from 'powerbi-client';
import { PowerBIEmbed } from 'powerbi-client-react';
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
    addAnnotation: (obj) => dispatch(addAnnotation(obj)),
    removeAnnotation: (obj) => dispatch(removeAnnotation(obj)),
    updateCurrentStreamState: (obj) => dispatch(updateCurrentStreamState(obj)),
    updateUSDStorage: (obj) => dispatch(updateUSDStorage(obj)),
    updateMSALInfo: (obj) => dispatch(updateMSALInfo(obj))
  };
};

const GlobalState = (props) => {

  const [isBusy, setBusy] = useState(true)
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();

  const selectAsset = (asset) => {
    props.selectAsset(asset);
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


  const updateMSALInfo = (asset) => {
    props.updateMSALInfo(asset);
  };

  
  const [token, setTokenVal] = useState();

  const setToken = async () => {
    const request = {
      scopes: ['https://analysis.windows.net/powerbi/api/Report.Read.All'],
      account: activeAccount
    };
    
    const authResult = await instance.acquireTokenSilent(request);
    setTokenVal(authResult.accessToken)
    setBusy(false)
  };

  useEffect(() => {
      updateUSDStorage({
        "url": "http://storage...",
        "sasToken": "sas token..."
      })
      updateMSALInfo({
        "userName": activeAccount.name,
        "authToken": activeAccount.idToken
      })
      setBusy(true)
      setToken()
    },[]);

  return (
    <div>

      Global State:
      <span>{JSON.stringify(props.state)}</span>
      
      <br />     
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

       
<br/><br/>
<h2>Power BI Embedded</h2>

        {isBusy ? (
                <div className="border-div">Loading</div>
              ) : (

                <div className="border-div"> 
                    <span>{token}</span>
                    <PowerBIEmbed
                        embedConfig = {{
                            type: 'report',   // Since we are reporting a BI report, set the type to report
                            id: '7a452715-3141-498a-8e7c-104ef8f80438', // Add the report Id here
                            embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=7a452715-3141-498a-8e7c-104ef8f80438&ctid=d2e5ac16-7068-4b2d-995b-3924af59cc7a', // Add the embed url here
                            accessToken:token,
                            tokenType: models.TokenType.Aad, // Since we are using an Azure Active Directory access token, set the token type to Aad
                            settings: {
                                panes: {
                                    filters: {
                                        expanded: false,
                                        visible: true
                                    }
                                },
                                background: models.BackgroundType.Transparent,
                            }
                        }}

                        eventHandlers = {
                            new Map([
                                ['loaded', function () {console.log('Report loaded');}],
                                ['rendered', function () {console.log('Report rendered');}],
                                ['error', function (event) {console.log(event.detail);}],
                                ['visualClicked', () => console.log('visual clicked')],
                                ['pageChanged', (event) => console.log(event)],
                            ])
                        }

                        cssClassName = { "bi-embedded" }

                        getEmbeddedComponent = { (embeddedReport) => {
                            window.report = embeddedReport; // save report in window object
                        }}
                    />

                </div>
              )};
 

        <h2>AIO</h2>
        <div className="border-div">

        </div>

        <h2>Kit App Streaming</h2>
        <div className="border-div">
          <Window/>
        </div>
      
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(GlobalState);
