import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/apiService';

// Async thunks
export const fetchCountries = createAsyncThunk(
  'countries/fetchCountries',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiService.getCountries();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch countries');
    }
  }
);

export const fetchChannelsByCountry = createAsyncThunk(
  'countries/fetchChannelsByCountry',
  async (countryCode, { rejectWithValue }) => {
    try {
      const data = await apiService.getChannelsByCountry(countryCode);
      return { countryCode, channels: data };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch channels');
    }
  }
);

export const fetchCategoriesByCountry = createAsyncThunk(
  'countries/fetchCategoriesByCountry',
  async (countryCode, { rejectWithValue }) => {
    try {
      const data = await apiService.getCategoriesByCountry(countryCode);
      return { countryCode, categories: data };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch categories');
    }
  }
);

const initialState = {
  countries: [],
  selectedCountry: null,
  channelsByCountry: {},
  categoriesByCountry: {},
  loading: false,
  error: null,
};

const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {
    setSelectedCountry: (state, action) => {
      state.selectedCountry = action.payload;
    },
    clearSelectedCountry: (state) => {
      state.selectedCountry = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearChannelsByCountry: (state, action) => {
      const countryCode = action.payload;
      delete state.channelsByCountry[countryCode];
      delete state.categoriesByCountry[countryCode];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch countries
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.countries = action.payload;
        state.error = null;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch channels by country
      .addCase(fetchChannelsByCountry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannelsByCountry.fulfilled, (state, action) => {
        state.loading = false;
        const { countryCode, channels } = action.payload;
        state.channelsByCountry[countryCode] = channels;
        state.error = null;
      })
      .addCase(fetchChannelsByCountry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch categories by country
      .addCase(fetchCategoriesByCountry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesByCountry.fulfilled, (state, action) => {
        state.loading = false;
        const { countryCode, categories } = action.payload;
        state.categoriesByCountry[countryCode] = categories;
        state.error = null;
      })
      .addCase(fetchCategoriesByCountry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedCountry,
  clearSelectedCountry,
  clearError,
  clearChannelsByCountry,
} = countriesSlice.actions;

export default countriesSlice.reducer;
