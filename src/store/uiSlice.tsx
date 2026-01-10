import { createSlice, type PayloadAction, isAnyOf } from '@reduxjs/toolkit';

export interface SystemTask {
    id: string;
    title: string;
    description: string;
    icon: string; // Icon identifier (e.g., 'fire', 'trophy', 'target')
    actionLink: string;
    completed?: boolean;
}

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number; // in milliseconds, default 3000
}

export interface AsyncOperation {
    id: string;
    name: string;
    status: 'loading' | 'success' | 'error';
    timestamp: number;
    error?: string;
}

interface UiSliceState {
    uiState:{
        loading:boolean;
        title?:string;
        message?:string;
    }
    showSidebar:boolean;
    showSidebarLables:boolean;
    systemTasks: SystemTask[];
    toasts: Toast[];
    asyncOperations: AsyncOperation[];
}



const initialState:UiSliceState  = {
    uiState:{
        loading:false
    },
    showSidebar:false,
    showSidebarLables:true,
    systemTasks: [],
    toasts: [],
    asyncOperations: []
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
    },
    setShowSidebarLabels:(state, action: PayloadAction<boolean>)=>{
        state.showSidebarLables = action.payload;
    },
    setSystemTasks:(state, action: PayloadAction<SystemTask[]>)=>{
        state.systemTasks = action.payload;
    },
    addSystemTask:(state, action: PayloadAction<SystemTask>)=>{
        state.systemTasks.push(action.payload);
    },
    removeSystemTask:(state, action: PayloadAction<string>)=>{
        state.systemTasks = state.systemTasks.filter(task => task.id !== action.payload);
    },
    completeSystemTask:(state, action: PayloadAction<string>)=>{
        const task = state.systemTasks.find(task => task.id === action.payload);
        if(task){
            task.completed = true;
        }
    },
    addToast:(state, action: PayloadAction<Omit<Toast, 'id'>>)=>{
        const id = `toast-${Date.now()}-${Math.random()}`;
        const newToast = { id, ...action.payload };
        
        // Limit to maximum 5 toasts - remove oldest if exceeding
        if (state.toasts.length >= 5) {
            state.toasts.shift(); // Remove the oldest toast
        }
        
        state.toasts.push(newToast);
    },
    removeToast:(state, action: PayloadAction<string>)=>{
        state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    clearToasts:(state)=>{
        state.toasts = [];
    },
    addAsyncOperation:(state, action: PayloadAction<Omit<AsyncOperation, 'timestamp'>>)=>{
        const operation = {
            ...action.payload,
            timestamp: Date.now()
        };
        state.asyncOperations.push(operation);
        
        // Auto-remove after 10 seconds if successful
        if (operation.status === 'success') {
            setTimeout(() => {
                // This will need to be handled in the component
            }, 10000);
        }
    },
    updateAsyncOperation:(state, action: PayloadAction<{ id: string; status: 'success' | 'error'; error?: string }>)=>{
        const operation = state.asyncOperations.find(op => op.id === action.payload.id);
        if (operation) {
            operation.status = action.payload.status;
            if (action.payload.error) {
                operation.error = action.payload.error;
            }
        }
    },
    removeAsyncOperation:(state, action: PayloadAction<string>)=>{
        state.asyncOperations = state.asyncOperations.filter(op => op.id !== action.payload);
    },
    clearAsyncOperations:(state)=>{
        state.asyncOperations = [];
    }
  },
  extraReducers: (builder) => {
    // Automatically track all async thunks
    builder
      .addMatcher(
        (action): action is any => action.type.endsWith('/pending'),
        (state, action) => {
          const operationId = action.meta?.requestId || `${action.type}-${Date.now()}`;
          const operationName = action.type.replace('/pending', '');
          
          state.asyncOperations.push({
            id: operationId,
            name: operationName,
            status: 'loading',
            timestamp: Date.now()
          });
        }
      )
      .addMatcher(
        (action): action is any => action.type.endsWith('/fulfilled'),
        (state, action) => {
          const operationId = action.meta?.requestId;
          if (operationId) {
            const operation = state.asyncOperations.find(op => op.id === operationId);
            if (operation) {
              operation.status = 'success';
            }
          }
        }
      )
      .addMatcher(
        (action): action is any => action.type.endsWith('/rejected'),
        (state, action) => {
          const operationId = action.meta?.requestId;
          if (operationId) {
            const operation = state.asyncOperations.find(op => op.id === operationId);
            if (operation) {
              operation.status = 'error';
              operation.error = action.error?.message || 'Unknown error';
            }
          }
        }
      );
  }
});

export const { 
    setUIState, 
    toggleSidebar, 
    setShowSidebarLabels, 
    setSystemTasks, 
    addSystemTask, 
    removeSystemTask, 
    completeSystemTask, 
    addToast, 
    removeToast, 
    clearToasts,
    addAsyncOperation,
    updateAsyncOperation,
    removeAsyncOperation,
    clearAsyncOperations
} = uiSlice.actions;
export default uiSlice.reducer;
