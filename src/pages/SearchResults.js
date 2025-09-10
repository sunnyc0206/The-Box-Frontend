import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiSearch, FiPlay, FiTv } from 'react-icons/fi';
import { useSearch, useCountries } from '../store/hooks';
import { searchChannels, setSelectedCountryFilter, setSortBy } from '../store/slices/searchSlice';
import img from '../assets/thebox.png';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
`;


const FiltersSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  background: ${props => props.theme.colors.card};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  cursor: pointer;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    outline: none;
  }
`;

const SortSelect = styled.select`
  padding: 0.75rem 1rem;
  background: ${props => props.theme.colors.card};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  cursor: pointer;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    outline: none;
  }
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const ChannelCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  overflow: hidden;
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

const ChannelLogo = styled.div`
  width: 100%;
  height: 180px;
  background: ${props => props.theme.colors.card};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .placeholder {
    font-size: 3rem;
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const PlayOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: ${props => props.theme.transitions.fast};
  
  ${ChannelCard}:hover & {
    opacity: 1;
  }
`;

const PlayIcon = styled(FiPlay)`
  font-size: 3rem;
  color: white;
`;

const ChannelInfo = styled.div`
  padding: 1.5rem;
`;

const ChannelName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: ${props => props.theme.colors.text};
  line-height: 1.4;
`;

const ChannelMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const MetaTag = styled.span`
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 0.75rem;
  font-weight: 500;
`;

const CountryTag = styled.span`
  background: ${props => props.theme.colors.secondary};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ChannelDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  line-height: 1.5;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const NoResults = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.colors.error};
`;

const SearchResults = ({countries, handleSelectedCountry}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const { 
    searchResults, 
    selectedCountryFilter, 
    sortBy, 
    loading, 
    error, 
    dispatch 
  } = useSearch();
  const { countries: countriesList } = useCountries();

  const query = searchParams.get('q');

  useEffect(() => {
    if (query) {
      dispatch(searchChannels({ query }));
    }
  }, [query, dispatch]);

  const filterAndSortResults = () => {
    let filtered = [...searchResults];

    // Filter by country
    if (selectedCountryFilter) {
      filtered = filtered.filter(channel => channel?.countryCode === selectedCountryFilter);
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'country':
          return a?.countryCode?.localeCompare(b.countryCode);
        case 'category':
          return (a.category || '').localeCompare(b.category || '');
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredResults = filterAndSortResults();

  const handleChannelClick = (channelId) => {
    navigate(`/channel/${channelId}`);
  };

  const handleCountryChange = (e) => {
    console.warn(e.target.value,"line 295 in handleCountryChange");
    dispatch(setSelectedCountryFilter(e.target.value));
  };

  const handleSortChange = (e) => {
    dispatch(setSortBy(e.target.value));
  };

  // const getCountryName = (countryCode) => {
  //   return countryCode === 'IN' ? 'India' : 'United States';
  // };

  // const getCountryFlag = (countryCode) => {
  //   return countryCode === 'IN' 
  //     ? 'https://flagcdn.com/w20/in.png' 
  //     : 'https://flagcdn.com/w20/us.png';
  // };

  if (loading) {
    return (
      <LoadingSpinner>
        <div>Searching channels...</div>
      </LoadingSpinner>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorMessage>
          <h2>Search Error</h2>
          <p>{error}</p>
        </ErrorMessage>
      </PageContainer>
    );
  }

  if (!query) {
    return (
      <PageContainer>
        <NoResults>
          <h2>No Search Query</h2>
          <p>Please enter a search term to find channels.</p>
        </NoResults>
      </PageContainer>
    );
  }

  // const uniqueCountries = [...new Set(results.map(channel => channel.countryCode))];

  return (
    <PageContainer>
      {/* <SearchHeader>
        <SearchTitle>Search Results</SearchTitle>
        <SearchQuery>
          <SearchIcon />
          <QueryText>"{query}"</QueryText>
        </SearchQuery>
      </SearchHeader> */}

      <FiltersSection>
        <FilterSelect value={selectedCountryFilter} onChange={handleCountryChange}>
          <option value="">All Countries</option>
          {countriesList.map(country => (
            <option key={country?.name} value={country?.code}>
              {(country.name)}
            </option>
          ))}
        </FilterSelect>
        
        <SortSelect value={sortBy} onChange={handleSortChange}>
          <option value="name">Sort by Name</option>
          <option value="country">Sort by Country</option>
          <option value="category">Sort by Category</option>
        </SortSelect>
      </FiltersSection>

      {filteredResults.length === 0 ? (
        <NoResults>
          <FiSearch size={48} />
          <h3>No channels found</h3>
          <p>Try adjusting your search terms or filters</p>
        </NoResults>
      ) : (
        <ResultsGrid>
          {filteredResults.map((channel) => (
            <ChannelCard
              key={channel.id}
              onClick={() => handleChannelClick(channel.id)}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChannelLogo>
                {channel.logoUrl ? (
                  <img src={img} alt={channel.name} />
                ) : (
                  <div className="placeholder">
                    <FiTv />
                  </div>
                )}
                <PlayOverlay>
                  <PlayIcon />
                </PlayOverlay>
              </ChannelLogo>
              
              <ChannelInfo>
                <ChannelName>{channel.name}</ChannelName>
                <ChannelMeta>
                  {channel.category && (
                    <MetaTag>{channel.category}</MetaTag>
                  )}
                  {channel.language && (
                    <MetaTag>{channel.language}</MetaTag>
                  )}
                  <CountryTag>
                    <img 
                      src={channel.countryCode} 
                      alt={channel.countryCode}
                      style={{ width: '12px', height: '8px' }}
                    />
                    {channel.countryCode}
                  </CountryTag>
                </ChannelMeta>
                <ChannelDescription>
                  {channel.name} is available on TheBox. Click to start streaming.
                </ChannelDescription>
              </ChannelInfo>
            </ChannelCard>
          ))}
        </ResultsGrid>
      )}
    </PageContainer>
  );
};

export default SearchResults; 