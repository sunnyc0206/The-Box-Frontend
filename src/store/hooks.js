import { useDispatch, useSelector } from 'react-redux';

// Custom hooks for typed Redux usage
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Countries hooks
export const useCountries = () => {
  const dispatch = useAppDispatch();
  const countries = useAppSelector((state) => state.countries.countries);
  const selectedCountry = useAppSelector((state) => state.countries.selectedCountry);
  const loading = useAppSelector((state) => state.countries.loading);
  const error = useAppSelector((state) => state.countries.error);
  
  return {
    countries,
    selectedCountry,
    loading,
    error,
    dispatch,
  };
};

// Channels hooks
export const useChannels = () => {
  const dispatch = useAppDispatch();
  const currentChannel = useAppSelector((state) => state.channels.currentChannel);
  const currentStream = useAppSelector((state) => state.channels.currentStream);
  const channelHealth = useAppSelector((state) => state.channels.channelHealth);
  const loading = useAppSelector((state) => state.channels.loading);
  const error = useAppSelector((state) => state.channels.error);
  
  return {
    currentChannel,
    currentStream,
    channelHealth,
    loading,
    error,
    dispatch,
  };
};

// UI hooks
export const useUI = () => {
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const errorModal = useAppSelector((state) => state.ui.errorModal);
  const loading = useAppSelector((state) => state.ui.loading);
  const theme = useAppSelector((state) => state.ui.theme);
  
  return {
    sidebarOpen,
    errorModal,
    loading,
    theme,
    dispatch,
  };
};

// Search hooks
export const useSearch = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.search.searchQuery);
  const searchResults = useAppSelector((state) => state.search.searchResults);
  const selectedCountryFilter = useAppSelector((state) => state.search.selectedCountryFilter);
  const sortBy = useAppSelector((state) => state.search.sortBy);
  const loading = useAppSelector((state) => state.search.loading);
  const error = useAppSelector((state) => state.search.error);
  const lastSearch = useAppSelector((state) => state.search.lastSearch);
  const countrySearchQuery = useAppSelector((state) => state.search.countrySearchQuery);
  
  return {
    searchQuery,
    searchResults,
    selectedCountryFilter,
    sortBy,
    loading,
    error,
    lastSearch,
    countrySearchQuery,
    dispatch,
  };
};
