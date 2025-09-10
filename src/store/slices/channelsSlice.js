import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/apiService';

// Async thunks
export const fetchChannel = createAsyncThunk(
  'channels/fetchChannel',
  async (channelId, { rejectWithValue }) => {
    try {
      const data = await apiService.getChannel(channelId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch channel');
    }
  }
);

export const fetchChannelStream = createAsyncThunk(
  'channels/fetchChannelStream',
  async (channelId, { rejectWithValue }) => {
    try {
      const data = await apiService.getChannelStream(channelId);
      return { channelId, streamUrl: data };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch channel stream');
    }
  }
);

export const checkChannelHealth = createAsyncThunk(
  'channels/checkChannelHealth',
  async (channelId, { rejectWithValue }) => {
    try {
      // This would need to be implemented in the backend
      // For now, we'll simulate it
      const response = await fetch(`/api/iptv/channels/${channelId}/health`);
      const data = await response.json();
      return { channelId, health: data };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to check channel health');
    }
  }
);

const initialState = {
  currentChannel: null,
  currentStream: null,
  channelHealth: {},
  loading: false,
  error: null,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannel = action.payload;
    },
    clearCurrentChannel: (state) => {
      state.currentChannel = null;
      state.currentStream = null;
    },
    setCurrentStream: (state, action) => {
      state.currentStream = action.payload;
    },
    clearCurrentStream: (state) => {
      state.currentStream = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch channel
      .addCase(fetchChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannel.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChannel = action.payload;
        state.error = null;
      })
      .addCase(fetchChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch channel stream
      .addCase(fetchChannelStream.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannelStream.fulfilled, (state, action) => {
        state.loading = false;
        const { channelId, streamUrl } = action.payload;
        state.currentStream = { channelId, streamUrl };
        state.error = null;
      })
      .addCase(fetchChannelStream.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Check channel health
      .addCase(checkChannelHealth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkChannelHealth.fulfilled, (state, action) => {
        state.loading = false;
        const { channelId, health } = action.payload;
        state.channelHealth[channelId] = health;
        state.error = null;
      })
      .addCase(checkChannelHealth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentChannel,
  clearCurrentChannel,
  setCurrentStream,
  clearCurrentStream,
  clearError,
} = channelsSlice.actions;

export default channelsSlice.reducer;
