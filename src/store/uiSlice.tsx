import { createSlice, type PayloadAction} from '@reduxjs/toolkit';




interface UiSliceState {
    uiState:{
        loading:boolean;
        title?:string;
        message?:string;
    }
}



const initialState:UiSliceState  = {
    uiState:{
        loading:false
    }
};



const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setUIState:(state,action:PayloadAction< { loading:boolean; title?:string ; message?:string  } >)=>{
        state.uiState = action.payload;
    }
  },
});

export const { setUIState } = uiSlice.actions;
export default uiSlice.reducer;
