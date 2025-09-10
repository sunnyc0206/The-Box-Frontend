import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/apiService';

// Async thunks
export const searchChannels = createAsyncThunk(
  'search/searchChannels',
  async ({ query, countryCode = null }, { rejectWithValue }) => {
    try {
      const data = await apiService.searchChannels(query, countryCode);
      return { query, countryCode, results: data };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to search channels');
    }
  }
);

const initialState = {
  searchQuery: '',
  searchResults: [],
  selectedCountryFilter: '',
  sortBy: 'name', // 'name', 'country', 'category'
  loading: false,
  error: null,
  lastSearch: null,
  countrySearchQuery: '',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCountryFilter: (state, action) => {
      state.selectedCountryFilter = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.lastSearch = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetSearch: (state) => {
      state.searchQuery = '';
      state.searchResults = [];
      state.selectedCountryFilter = '';
      state.sortBy = 'name';
      state.lastSearch = null;
      state.error = null;
    },
    setCountrySearchQuery: (state, action) => {
      state.countrySearchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchChannels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchChannels.fulfilled, (state, action) => {
        state.loading = false;
        const { query, countryCode, results } = action.payload;
        state.searchResults = results;
        state.lastSearch = { query, countryCode };
        state.error = null;
      })
      .addCase(searchChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSearchQuery,
  setSelectedCountryFilter,
  setSortBy,
  clearSearchResults,
  clearError,
  resetSearch,
  setCountrySearchQuery,
} = searchSlice.actions;

export default searchSlice.reducer;
