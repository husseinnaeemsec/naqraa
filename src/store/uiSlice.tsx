import { createSlice, type PayloadAction} from '@reduxjs/toolkit';




interface UiSliceState {
    uiState:{
        loading:boolean;
        title?:string;
        message?:string;
    }
    showSidebar:boolean

}



const initialState:UiSliceState  = {
    uiState:{
        loading:false
    },
    showSidebar:false
};



const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setUIState:(state,action:PayloadAction< { loading:boolean; title?:string ; message?:string  } >)=>{
        state.uiState = action.payload;
    },
    toggleSidebar:(state)=>{
        state.showSidebar = !state.showSidebar;
    }
  },
});

export const { setUIState , toggleSidebar} = uiSlice.actions;
export default uiSlice.reducer;
