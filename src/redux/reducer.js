import { createSlice } from "@reduxjs/toolkit";

const initialState ={  
    "USDStorageURL":"https://blobstorage.azurewebsites.net",
    "USDStorageToken":"",
    "currentStreamState":{
        "state":"intialize",
        "message":"please wait..."
    },
    "selectedAssets": [],
    "assetAnnotations": [{
        "id":"asset2",
        "status":"warning",
        "state":"on",
        "message":"Something is wrong with this machine.",
        "icon":""
    }]
};

const addGlobalStateBusReducer = createSlice({
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
    }
  },
});

export const {
  selectAsset,
  unselectAsset
} = addGlobalStateBusReducer.actions;
export const reducer = addGlobalStateBusReducer.reducer;
