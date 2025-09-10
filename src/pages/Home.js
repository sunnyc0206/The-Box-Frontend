import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiPlay, FiGlobe, FiTv, FiStar } from 'react-icons/fi';
import SkeletonLoader from '../components/SkeletonLoader';
import { useSearch } from '../store/hooks'; // Import useSearch to get the search query

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const Section = styled.section`
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const CountriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const CountryCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

const CountryFlag = styled.img`
  width: 80px;
  height: 60px;
  border-radius: ${props => props.theme.borderRadius.small};
  margin-bottom: 1rem;
  object-fit: cover;
`;

const CountryName = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
`;

const CountryDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1.5rem;
`;

const ExploreButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.small};
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.secondary};
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 2rem;
  text-align: center;
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const NoResults = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: ${props => props.theme.colors.textSecondary};
  padding: 5rem 0;
  text-align: center;
`;

const Home = ({ countries, loading, handleSelectedCountry, selectedCountry }) => {
  const navigate = useNavigate();
  const { countryCode } = useParams();
  
  // Use the useSearch hook to get the search query from Redux
  const { countrySearchQuery } = useSearch();

  // Filter countries based on the Redux state
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(countrySearchQuery.toLowerCase())
  );

  useEffect(() => {
    // This effect is not needed as Redux manages the selected country
    // and is a better approach than using localStorage
    if (!countryCode) {
      // Logic to clear selected country from Redux can go here if needed
      // (This is already handled by the App component on navigation)
    }
  }, [countryCode]);

  const handleCountryClick = (countryCode) => {
    const country = countries.find(c => c?.code === countryCode);
    handleSelectedCountry(country);
    navigate(`/country/${countryCode}`);
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <HomeContainer>
      <Section>
        <SectionTitle>
          <FiGlobe />
          Available Countries
        </SectionTitle>
        {filteredCountries.length > 0 ? (
          <CountriesGrid>
            {filteredCountries.map((country) => (
              <CountryCard
                key={country.code}
                onClick={() => handleCountryClick(country.code)}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <CountryFlag src={country.flagUrl} alt={country.name} />
                <CountryName>{country.name}</CountryName>
                <CountryDescription>
                  Explore channels from {country.name} including news, entertainment, sports, and more.
                </CountryDescription>
                <ExploreButton>Explore Channels</ExploreButton>
              </CountryCard>
            ))}
          </CountriesGrid>
        ) : (
          <NoResults>
            No countries match your search. Try a different query.
          </NoResults>
        )}
      </Section>

      <Section>
        <SectionTitle>
          <FiStar />
          Why Choose TheBox?
        </SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>
              <FiTv />
            </FeatureIcon>
            <FeatureTitle>High Quality Streams</FeatureTitle>
            <FeatureDescription>
              Enjoy crystal clear video quality with our optimized streaming technology.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FiGlobe />
            </FeatureIcon>
            <FeatureTitle>Global Content</FeatureTitle>
            <FeatureDescription>
              Access channels from multiple countries with diverse content and languages.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FiPlay />
            </FeatureIcon>
            <FeatureTitle>Easy Navigation</FeatureTitle>
            <FeatureDescription>
              Intuitive interface makes it simple to find and watch your favorite channels.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </Section>
    </HomeContainer>
  );
};

export default Home;
