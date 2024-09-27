import React, {useEffect,useState } from "react";
import { useMsal } from '@azure/msal-react';
import { connect } from "react-redux";
import { selectAsset,unselectAsset,addAnnotation,removeAnnotation,updateCurrentStreamState,updateUSDStorage,updateMSALInfo} from "../redux/reducer";
import SelectedAsset from "./SelectedAsset";
import AssetAnnotation from "./AssetAnnotation";

import { models } from 'powerbi-client';
import { PowerBIEmbed } from 'powerbi-client-react';



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


useEffect(()=>
  updateMSALInfo({
    "userName": activeAccount.name,
    "authToken": activeAccount.idToken
  }) , []);

useEffect(()=>
  updateUSDStorage({
    "url": "http://storage...",
    "sasToken": "sas token..."
  }), []);

  useEffect(() => {
      setBusy(true)
      setToken()
    }
  ,[]);

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
                            id: '286681f1-fa0e-462b-96b8-d0a391465e50', // Add the report Id here
                            embedUrl: 'https://msit.powerbi.com/reportEmbed?reportId=286681f1-fa0e-462b-96b8-d0a391465e50&ctid=72f988bf-86f1-41af-91ab-2d7cd011db47', // Add the embed url here
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
                                ['error', function (event) {alert(JSON.stringify(event.detail));}],
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

        </div>
      
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(GlobalState);
