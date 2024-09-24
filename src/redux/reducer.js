import { createSlice } from "@reduxjs/toolkit";

const initialState ={  
    "USDStorageURL":"https://blobstorage.azurewebsites.net",
    "USDStorageToken":"",
    "currentStreamState":{
        "state":"intialize",
        "message":"please wait..."
    },
    "selectedAssets": ["asset1"],
    "assetAnnotations": [{
      "id":1,
      "asset":"asset1",
      "status":"warning",
      "state":"on",
      "message":"something is wrong with this machine.",
      "icon":""
  }]
};

const addGlobalStateReducer = createSlice({
  name: "global_state",
  initialState,
  reducers: {
    selectAsset: (state=initialState, action) => {
      if(!state.selectedAssets.includes(action.payload)){
        state.selectedAssets.push(action.payload)
      }
      return state;
    },
    unselectAsset: (state=initialState, action) => {
      state.selectedAssets=state.selectedAssets.filter((item) => item !== action.payload);
      return state;
    },
    addAnnotation: (state=initialState, action) => {
      if(!state.assetAnnotations.some(item => item.id === action.payload.id)){
        state.assetAnnotations.push(action.payload)
      }
      return state;
    },
    removeAnnotation: (state=initialState, action) => {
      state.assetAnnotations=state.assetAnnotations.filter((item) => item.id !== action.payload.id);
      return state;
    },
    updateCurrentStreamState: (state=initialState, action) => {
      state.currentStreamState=action.payload;
      return state;
    },
    updateUSDStorageURL: (state=initialState, action) => {
      state.USDStorageURL=action.payload;
      return state;
    },
    updateUSDStorageToken: (state=initialState, action) => {
      state.USDStorageToken=action.payload;
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
  updateUSDStorageURL,
  updateUSDStorageToken
} = addGlobalStateReducer.actions;
export const reducer = addGlobalStateReducer.reducer;
