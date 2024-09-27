import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  "msalInfo":{
      "userName":"<username>",
      "authToken": "<authToken>"
  },
  "usdStorage": {
    "url": "<url>",
    "sasToken": "<sastoken>",
  },
  "usdViewport": {
    "sessionService": {
      "address": "<address>",// ex. https://contoso.com:10555    
      "path": "<path>" // basePath  
    },
    "sessionInfo": { // Private
      // Only relevant to Viewport Component  // signaling/media // source+destination server+ports  
    },
   
    "currentStreamState": {
      "state": "intilizing", // enum   intilizing, stopped, streaming, stopping
      "message": "please wait..."
    },
  },
  "selectedAssetIds": ["asset1", "asset3"],
  "assetAnnotations": [{
    "id": "asset2",
    "status": "warning",
    "state": "on",
    "message": "Something is wrong with this machine.",
    "icon": ""
  }]
};

// NOT_STARTED, REQUESTING, INITIALIZING, WAITING (for resources to free up to start a stream), 
// CONNECTING, STREAMING, STOPPING, STOPPED (distinct from not started, I think), 
// TERMINATING, LOADING, USD_LOADING, USD_LOADED

//Progress eventually%


const addGlobalStateReducer = createSlice({
  name: "global_state",
  initialState,
  reducers: {
    selectAsset: (state = initialState, action) => {
      if (!state.selectedAssetIds.includes(action.payload)) {
        state.selectedAssetIds.push(action.payload)
      }
      return state;
    },
    unselectAsset: (state = initialState, action) => {
      state.selectedAssetIds = state.selectedAssetIds.filter((item) => item !== action.payload);
      return state;
    },
    addAnnotation: (state = initialState, action) => {
      if (!state.assetAnnotations.some(item => item.id === action.payload.id)) {
        state.assetAnnotations.push(action.payload)
      }
      return state;
    },
    removeAnnotation: (state = initialState, action) => {
      state.assetAnnotations = state.assetAnnotations.filter((item) => item.id !== action.payload.id);
      return state;
    },
    updateCurrentStreamState: (state = initialState, action) => {
      state.currentStreamState = action.payload;
      return state;
    },
    updateUSDStorage: (state = initialState, action) => {
      state.usdStorage = action.payload;
      return state;
    },
    updateMSALInfo: (state = initialState, action) => {
      state.msalInfo = action.payload;
      return state;
    }
  },
});

export const {
  selectAsset,
  unselectAsset,
  addAnnotation,
  removeAnnotation,
  updateCurrentStreamState,
  updateUSDStorage,
  updateMSALInfo
} = addGlobalStateReducer.actions;
export const reducer = addGlobalStateReducer.reducer;
