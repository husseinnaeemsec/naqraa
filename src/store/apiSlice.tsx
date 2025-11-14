import { createSlice} from '@reduxjs/toolkit';




interface ApiSliceState {
    changed_resources:{resources:string,last_updated:string}[];
    last_pulled:string|null;
}



const initialState:ApiSliceState  = {
    changed_resources:[],
    last_pulled:null,
};

const apiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setChangedResources:(state,action)=>{
        state.changed_resources = action.payload
    }
  },
});

export const {setChangedResources} = apiSlice.actions;
export default apiSlice.reducer;
