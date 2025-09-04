import React, {useEffect, useState} from 'react';

import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import CountryChannels from './pages/CountryChannels';
import ChannelPlayer from './pages/ChannelPlayer';
import SearchResults from './pages/SearchResults';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles, theme } from './styles/GlobalStyles';
import apiService from './services/apiService';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-left: ${props => props.sidebarOpen ? '280px' : '0'};
  transition: margin-left ${props => props.theme.transitions.medium};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    margin-left: 0;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const { countryCode } = useParams();


  
useEffect(() => {
  
  if (countries.length > 0) {
    const storedCountryJSON = localStorage.getItem('selectedCountry');
    if (storedCountryJSON) {
      try {
        const storedCountry = JSON.parse(storedCountryJSON);
        const foundCountry = countries.find(c => c.code === storedCountry.code);
        if (foundCountry) {
          console.log('Restoring selected country from localStorage:', foundCountry);
          setSelectedCountry(foundCountry);
          return; 
        }
      } catch (error) {
        console.error('Failed to parse selected country from localStorage:', error);
        localStorage.removeItem('selectedCountry'); 
      }
    }

    if (countryCode) {
      const countryFromURL = countries.find(c => c.code === countryCode);
      if (countryFromURL) {
        console.log('Selecting country from URL:', countryFromURL);
        setSelectedCountry(countryFromURL);
      }
    }
  }
}, [countries]); 

  useEffect(() => {
    fetchCountries();
  }, []);
 
  const fetchCountries = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCountries();
      setCountries(data);
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectedCountry = (data, code='') => {
    let countryToSelect;
    if(code === 'code'){
       countryToSelect = countries.filter(c => c.code === data);
      console.warn("country selected from params", data, countryToSelect);
      setSelectedCountry(countryToSelect);
    }else{
       countryToSelect = data;
      console.warn("country seleted by click", data);
      setSelectedCountry(countryToSelect);
    }
    if (countryToSelect) {
      try {
        localStorage.setItem('selectedCountry', JSON.stringify(countryToSelect));
        console.log('Country saved to localStorage');
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    }
    
 }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <AppContainer>
          <Sidebar countries={countries} handleSelectedCountry={handleSelectedCountry} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <MainContent sidebarOpen={sidebarOpen}>
            <Header onMenuToggle={toggleSidebar} />
            <ContentArea>
              <Routes>
                <Route path="/" element={<Home countries={countries} handleSelectedCountry={handleSelectedCountry} loading={loading} />} />
                <Route path="/country/:countryCode" element={<CountryChannels selectedCountry={selectedCountry}  handleSelectedCountry={handleSelectedCountry} />} />
                <Route path="/channel/:channelId" element={<ChannelPlayer />} />
                <Route path="/search" element={<SearchResults countries={countries} handleSelectedCountry={handleSelectedCountry} selectedCountry={selectedCountry}/>} />
              </Routes>
            </ContentArea>
          </MainContent>
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
}

export default App; 