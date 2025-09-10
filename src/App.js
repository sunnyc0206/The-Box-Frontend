// src/App.jsx

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import styled from "styled-components";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import CountryChannels from "./pages/CountryChannels";
import ChannelPlayer from "./pages/ChannelPlayer";
import SearchResults from "./pages/SearchResults";
import { ThemeProvider } from "styled-components";
import { GlobalStyles, darkTheme, lightTheme } from "./styles/GlobalStyles";
import { AnimatePresence } from "framer-motion";
import ErrorModal from "./components/ErrorModal";
import { store, persistor } from "./store";
import { useCountries, useUI } from "./store/hooks"; 
import {
  fetchCountries,
  setSelectedCountry,
} from "./store/slices/countriesSlice";
import {
  showErrorModal,
  hideErrorModal,
  setSidebarOpen,
  toggleSidebar,
} from "./store/slices/uiSlice";

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-left: ${(props) => (props.sidebarOpen ? "280px" : "0")};
  transition: margin-left ${(props) => props.theme.transitions.medium};

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    margin-left: 0;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;


function AppWrapper() {
  const { theme } = useUI(); 
  const selectedTheme = theme === "dark" ? darkTheme : lightTheme;
  console.error('selected theme', theme, selectedTheme);

  return (
    <ThemeProvider theme={selectedTheme}>
      <GlobalStyles />
      <AppContent />
    </ThemeProvider>
  );
}

// Main App Component (wrapped with Redux Provider and PersistGate)
function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <AppWrapper />
      </PersistGate>
    </Provider>
  );
}

// App Content Component (uses Redux hooks)
function AppContent() {
  const { countries, selectedCountry, loading, error, dispatch } = useCountries();
  const { sidebarOpen, errorModal, dispatch: uiDispatch } = useUI();
  const { countryCode } = useParams();

  useEffect(() => {
    if (countries.length === 0) {
      dispatch(fetchCountries());
    }
  }, [dispatch, countries.length]);

  useEffect(() => {
    if (countries.length > 0) {
      if (countryCode) {
        const countryFromURL = countries.find((c) => c.code === countryCode);
        if (countryFromURL) {
          console.log("Selecting country from URL:", countryFromURL);
          dispatch(setSelectedCountry(countryFromURL));
        }
      }
    }
  }, [countries, countryCode, dispatch]);

  useEffect(() => {
    if (error) {
      uiDispatch(showErrorModal(
        "The server is busy or still loading. Give it a few minutes and try again."
      ));
    }
  }, [error, uiDispatch]);

  const handleSelectedCountry = (data, code = "") => {
    let countryToSelect;
    if (code === "code") {
      countryToSelect = countries.filter((c) => c.code === data);
      console.warn("country selected from params", data, countryToSelect);
      dispatch(setSelectedCountry(countryToSelect));
    } else {
      countryToSelect = data;
      console.warn("country selected by click", data);
      dispatch(setSelectedCountry(countryToSelect));
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleToggleSidebar = () => {
    uiDispatch(toggleSidebar());
  };

  return (
    <Router>
      <AppContainer>
        <AnimatePresence>
          {sidebarOpen && (
            <Sidebar
              countries={countries}
              handleSelectedCountry={handleSelectedCountry}
              isOpen={sidebarOpen}
              onClose={() => uiDispatch(setSidebarOpen(false))}
            />
          )}
        </AnimatePresence>
        <MainContent sidebarOpen={sidebarOpen}>
          <Header onMenuToggle={handleToggleSidebar} sidebarOpen={sidebarOpen} />
          <ContentArea>
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    countries={countries}
                    handleSelectedCountry={handleSelectedCountry}
                    loading={loading}
                  />
                }
              />
              <Route
                path="/country/:countryCode"
                element={
                  <CountryChannels
                    selectedCountry={selectedCountry}
                    handleSelectedCountry={handleSelectedCountry}
                  />
                }
              />
              <Route path="/channel/:channelId" element={<ChannelPlayer />} />
              <Route
                path="/search"
                element={
                  <SearchResults
                    countries={countries}
                    handleSelectedCountry={handleSelectedCountry}
                    selectedCountry={selectedCountry}
                  />
                }
              />
            </Routes>
          </ContentArea>
        </MainContent>
        <AnimatePresence>
          {errorModal.isOpen && (
            <ErrorModal
              message={errorModal.message}
              onRefresh={handleRefresh}
              onClose={() => uiDispatch(hideErrorModal())}
            />
          )}
        </AnimatePresence>
      </AppContainer>
    </Router>
  );
}

export default App;