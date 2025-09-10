import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: true,
  errorModal: {
    isOpen: false,
    message: null,
  },
  loading: false,
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    showErrorModal: (state, action) => {
      state.errorModal = {
        isOpen: true,
        message: action.payload,
      };
    },
    hideErrorModal: (state) => {
      state.errorModal = {
        isOpen: false,
        message: null,
      };
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  showErrorModal,
  hideErrorModal,
  setLoading,
  setTheme,
} = uiSlice.actions;

export default uiSlice.reducer;
