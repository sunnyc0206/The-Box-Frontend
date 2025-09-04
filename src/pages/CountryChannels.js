import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiPlay, FiFilter, FiSearch, FiTv, FiGlobe } from 'react-icons/fi';
import { apiService } from '../services/apiService';
import img from '../assets/thebox.png';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 2rem;
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.medium};
  border: 1px solid ${props => props.theme.colors.border};
`;

const CountryFlag = styled.img`
  width: 60px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.small};
  object-fit: cover;
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const CountryName = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
`;

const ChannelCount = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.1rem;
`;

const ControlsSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
`;

const SearchContainer = styled.div`
  flex: 1;
  min-width: 300px;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  background: ${props => props.theme.colors.card};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    outline: none;
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
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

const CategoriesSection = styled.div`
  margin-bottom: 2rem;
`;

const CategoryTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChannelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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
  height: 160px;
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
  padding: 1rem;
`;

const ChannelName = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
  line-height: 1.4;
`;

const ChannelMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const CategoryTag = styled.span`
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 0.75rem;
  font-weight: 500;
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

const CountryChannels = ({selectedCountry, handleSelectedCountry}) => {
  const { countryCode } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [channels, setChannels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredChannels, setFilteredChannels] = useState([]);

  const categoryFilter = searchParams.get('category');

  useEffect(() => {
    const storedCountryJSON = localStorage.getItem('selectedCountry');
    
    if (storedCountryJSON) {
        const storedCountry = JSON.parse(storedCountryJSON);
        selectedCountry = storedCountry;
      } 
  }, [countryCode]);

  useEffect(() => {
    if (countryCode) {
      fetchData();
      // handleSelectedCountry(countryCode, 'code');
    }
  }, [countryCode, categoryFilter]);

  useEffect(() => {
    filterChannels();
  }, [channels, searchQuery, selectedCategory]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [channelsData, categoriesData] = await Promise.all([
        apiService.getChannelsByCountry(countryCode),
        apiService.getCategoriesByCountry(countryCode)
      ]);
      
      setChannels(channelsData);
      setCategories(categoriesData);
      
      // Set category filter from URL if present
      if (categoryFilter) {
        setSelectedCategory(categoryFilter);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterChannels = () => {
    let filtered = [...channels];

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(channel => channel.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(channel =>
        channel.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredChannels(filtered);
  };

  const handleChannelClick = (channelId) => {
    navigate(`/channel/${channelId}`);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category) {
      navigate(`/country/${countryCode}?category=${encodeURIComponent(category)}`);
    } else {
      navigate(`/country/${countryCode}`);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return (
      <LoadingSpinner>
        <div>Loading channels...</div>
      </LoadingSpinner>
    );
  }

  // const countryName = countryCode === 'IN' ? 'India' : 'United States';
  // const flagUrl = countryCode === 'IN' 
  //   ? 'https://flagcdn.com/w40/in.png' 
  //   : 'https://flagcdn.com/w40/us.png';

  return (
    <PageContainer>
      <PageHeader>
        <CountryFlag src={selectedCountry?.flagUrl} alt={selectedCountry?.name} />
        <HeaderContent>
          <CountryName>{selectedCountry?.name} Channels</CountryName>
          <ChannelCount>{channels.length} channels available</ChannelCount>
        </HeaderContent>
        <ControlsSection>
        <FiFilter />

        <FilterSelect 
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="">ALL CATEGORIES</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.toUpperCase()}
            </option>
          ))}
        </FilterSelect>

      </ControlsSection>
      </PageHeader>
    

      {filteredChannels.length === 0 ? (
        <NoResults>
          <FiTv size={48} />
          <h3>No channels found</h3>
          <p>Try adjusting your search or category filters</p>
        </NoResults>
      ) : (
        <ChannelsGrid>
          {filteredChannels.map((channel) => (
            <ChannelCard
              key={channel.id}
              onClick={() => handleChannelClick(channel.id)}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChannelLogo>
                {channel.logoUrl ? (
                  <img src={img} alt={img}  />
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
                    <CategoryTag>{channel.category}</CategoryTag>
                  )}
                  {channel.language && (
                    <span>{channel.language}</span>
                  )}
                </ChannelMeta>
              </ChannelInfo>
            </ChannelCard>
          ))}
        </ChannelsGrid>
      )}
    </PageContainer>
  );
};

export default CountryChannels; 