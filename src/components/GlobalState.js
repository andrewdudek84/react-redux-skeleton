import React, {useEffect,useState } from "react";
import { useMsal } from '@azure/msal-react';
import { connect } from "react-redux";
import { selectAsset,unselectAsset,unselectAllAsset,addAnnotation,removeAnnotation,updateCurrentStreamState,updateUSDStorage,updateMSALInfo} from "../redux/reducer";
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
    unselectAllAsset: (obj) => dispatch(unselectAllAsset(obj)),
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


   const basicFilter = {
      $schema: "http://powerbi.com/product/schema#basic",
      target: {
        table: "Assets",
        column: "Asset"
      },
      operator: "In",
      values: props.state.selectedAssetIds.length>0? props.state.selectedAssetIds:["Select all"],
      filterType: models.FilterType.BasicFilter
    };
    
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
     

       
      <br/><br/>
      <h2>Power BI Embedded</h2>

        {isBusy ? (
                <div className="border-div">Loading</div>
              ) : (

                <div className="border-div"> 
                    <PowerBIEmbed
                        embedConfig = {{
                            type: 'report',   // Since we are reporting a BI report, set the type to report
                            id: '6e9ad4fb-4e8a-4a92-bfa4-95c4198e88ae', // Add the report Id here
                            embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=6e9ad4fb-4e8a-4a92-bfa4-95c4198e88ae&ctid=d2e5ac16-7068-4b2d-995b-3924af59cc7a', // Add the embed url here
                            accessToken:token,
                            tokenType: models.TokenType.Aad, // Since we are using an Azure Active Directory access token, set the token type to Aad
                            filters:[basicFilter],
                            settings: {
                                panes: {
                                    filters: {
                                        expanded: false,
                                        visible: true
                                    },
                                    pageNavigation: {
                                      visible: false
                                    }
                                },
                                background: models.BackgroundType.Transparent,
                            }
                        }}

                        eventHandlers = {
                            new Map([
                                ['loaded', function () {

                                  window.report.on('filtersApplied', (event) => {
                                    alert('Filters applied:', event.detail);
                                  });
                          
                                  window.report.on('dataSelected', (event) => {
                                    
                                    const value = event?.detail?.dataPoints?.[0]?.identity?.[0]?.equals;
                                    if (value) {
                                      unselectAllAsset()
                                      selectAsset(value)
                                    }
                                     
                                  });
                                  //window.report.getPages().then(pages => {
                                    //pages[0].getVisuals().then(visuals => {
                                       // const slicers = visuals.find(visual => visual.type === 'slicer');
                                        //for (let x = 0; x < visuals.length; x++) {
                                        //  if (visuals[x].type === 'slicer' && visuals[x].title=='asset') {
                                              
                                         //     visuals[x].setSlicerState({ 'filters': [basicFilter] });
      
                                        //  }
                                        //}
                                    //});
                                  //});
                                  

                                 // identity: A unique identifier for the data point.
//values: The values associated with the data point.
//highlight: Indicates whether the data point is highlighted.
//category: The category to which the data point belongs.
//series: The series to which the data point belongs.
//measure: The measure associated with the data point.
//color: The color of the data point.
//tooltip: The tooltip information for the data point.
                                  //loaded,saved,rendered,saveAsTriggered,error,dataSelected,buttonClicked,info,filtersApplied,pageChanged,commandTriggered,swipeStart,swipeEnd,bookmarkApplied,dataHyperlinkClicked,visualRendered,visualClicked,selectionChanged,renderingStarted,blur

                                }],
                                ['rendered', function () {console.log('Report rendered');}],
                                ['error', function (event) {console.log(event.detail);}],
                                ['visualClicked', () => console.log('visual clicked')],
                                ['pageChanged', (event) => console.log(event)]
        

                                
                            ])
                        }

                        cssClassName = { "bi-embedded" }

                        getEmbeddedComponent = { (embeddedReport) => {
                            window.report = embeddedReport; 
                            
                        }}
                    />



                </div>
              )};
 

        

        <h2>Kit App Streaming</h2>
        <div className="border-div">
          <Window/>
        </div>

        <h2>AIO</h2>
        <div className="border-div">

        </div>

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
