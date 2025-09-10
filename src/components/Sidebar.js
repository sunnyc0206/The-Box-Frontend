import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiSearch,
  FiX,
} from "react-icons/fi";
import { apiService } from "../services/apiService";
import { useAppDispatch, useSearch } from "../store/hooks";
import { setCountrySearchQuery } from "../store/slices/searchSlice";

const SidebarContainer = styled(motion.aside)`
  width: 280px;
  background: ${(props) => props.theme.colors.surface};
  border-right: 1px solid ${(props) => props.theme.colors.border};
  height: 100vh;
  overflow-y: auto;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 200;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    width: 100%;
    max-width: 320px;
  }
`;

const SearchContainer = styled.div`
  flex: 1;
  position: relative;
  padding: 0 1.5rem; /* Added padding to align with other sections */
  margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  background: ${(props) => props.theme.colors.card};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.medium};
  color: ${(props) => props.theme.colors.text};
  font-size: 1rem;
  transition: ${(props) => props.theme.transitions.fast};

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: ${(props) => props.theme.shadows.glow};
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.textSecondary};
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 2.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 1.2rem;
`;

const SidebarTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const SidebarSubtitle = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.textSecondary};
`;

const NavigationSection = styled.div`
  padding: 1.5rem 0;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`;

const SectionTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0 1.5rem 0.75rem;
`;

const NavItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: ${(props) =>
    props.$isActive ? props.theme.colors.primary : props.theme.colors.text};
  cursor: pointer;
  transition: ${(props) => props.theme.transitions.fast};
  border-left: 3px solid
    ${(props) => (props.$isActive ? props.theme.colors.primary : "transparent")};

  &:hover {
    background: ${(props) => props.theme.colors.card};
    color: ${(props) => props.theme.colors.primary};
  }
`;

const NavIcon = styled.div`
  font-size: 1.2rem;
  display: flex;
  align-items: center;
`;

const NavText = styled.span`
  font-weight: ${(props) => (props.$isActive ? "600" : "400")};
`;

const CountryItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: ${(props) =>
    props.$isActive ? props.theme.colors.primary : props.theme.colors.text};
  cursor: pointer;
  transition: ${(props) => props.theme.transitions.fast};
  border-left: 3px solid
    ${(props) => (props.$isActive ? props.theme.colors.primary : "transparent")};

  &:hover {
    background: ${(props) => props.theme.colors.card};
    color: ${(props) => props.theme.colors.primary};
  }
`;

const CountryFlag = styled.img`
  width: 24px;
  height: 16px;
  border-radius: 2px;
  object-fit: cover;
`;

const CategoryItem = styled(motion.div)`
  padding: 0.5rem 1.5rem 0.5rem 3rem;
  color: ${(props) =>
    props.$isActive
      ? props.theme.colors.primary
      : props.theme.colors.textSecondary};
  cursor: pointer;
  font-size: 0.875rem;
  transition: ${(props) => props.theme.transitions.fast};

  &:hover {
    color: ${(props) => props.theme.colors.primary};
    background: ${(props) => props.theme.colors.card};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.5rem;
  cursor: pointer;
  position: absolute;
  top: 1rem;
  right: 1rem;
  transition: ${props => props.theme.transitions.fast};
  
  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const SidebarHeader = styled.div`
  padding: 2rem 1.5rem 1rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  position: relative;
`;

const Sidebar = ({
  isOpen,
  onClose,
  countries,
  selectedCountry,
  handleSelectedCountry,
}) => {
  const [categories, setCategories] = useState({});
  //const [countrySearchQuery, setCountrySearchQuery] = useState("");

  const { countrySearchQuery } = useSearch();
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
   
    const handleClickOutside = (event) => {
      
      if (isOpen && window.innerWidth <= 768) {
        const sidebar = document.querySelector('[data-sidebar]');
       
        if (sidebar && !sidebar.contains(event.target)) {
          onClose();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]); 

  useEffect(() => {
    if (selectedCountry) {
      fetchCategories(selectedCountry.code);
    }
  }, [selectedCountry]);

  const fetchCategories = async (countryCode) => {
    try {
      const data = await apiService.getCategoriesByCountry(countryCode);
      setCategories((prev) => ({ ...prev, [countryCode]: data }));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCountryClick = (country) => {
    handleSelectedCountry(
      selectedCountry?.code === country.code ? null : country
    );
    navigate(`/country/${country.code}`);
    
    
    if (window.innerWidth <= 768) {
        onClose(); 
    }
  };

  const handleCategoryClick = (category) => {
    if (selectedCountry) {
      navigate(
        `/country/${selectedCountry.code}?category=${encodeURIComponent(
          category
        )}`
      );
    }
    if (window.innerWidth <= 768) {
        onClose();
    }
  };

  const handleHomeClick = () => {
    navigate("/");
    handleSelectedCountry(null);
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  const handleCountrySearch = (e) => {
    //setCountrySearchQuery(e.target.value);
    dispatch(setCountrySearchQuery(e.target.value));
  };

  const isActive = (path) => location.pathname === path;

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(countrySearchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <SidebarContainer
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          exit={{ x: -280 }}
          data-sidebar
        >
          <SidebarHeader>
            <SidebarTitle>TheBox</SidebarTitle>
            <SidebarSubtitle>Your IPTV Streaming Hub</SidebarSubtitle>
            <CloseButton onClick={onClose}>
              <FiX />
            </CloseButton>
          </SidebarHeader>

          <NavigationSection>
            <SectionTitle>Navigation</SectionTitle>
            <NavItem
              $isActive={isActive("/")}
              onClick={handleHomeClick}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <NavIcon>
                <FiHome />
              </NavIcon>
              <NavText $isActive={isActive("/")}>Home</NavText>
            </NavItem>
          </NavigationSection>

          <NavigationSection>
            <SectionTitle>Countries</SectionTitle>
            <SearchContainer>
              <SearchIcon />
              <SearchInput
                type="text"
                placeholder="Search countries..."
                value={countrySearchQuery} 
                onChange={handleCountrySearch}
              />
            </SearchContainer>

            {filteredCountries.map((country) => (
              <CountryItem
                key={country.code}
                $isActive={location.pathname.includes(`/country/${country.code}`)}
                onClick={() => handleCountryClick(country)}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <CountryFlag src={country.flagUrl} alt={country.name} />
                <NavText
                  $isActive={location.pathname.includes(
                    `/country/${country.code}`
                  )}
                >
                  {country.name}
                </NavText>
              </CountryItem>
            ))}
          </NavigationSection>

          {selectedCountry && categories[selectedCountry.code] && (
            <NavigationSection>
              <SectionTitle>Categories - {selectedCountry.name}</SectionTitle>
              {categories[selectedCountry.code].map((category) => (
                <CategoryItem
                  key={category}
                  $isActive={location.search.includes(
                    `category=${encodeURIComponent(category)}`
                  )}
                  onClick={() => handleCategoryClick(category)}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </CategoryItem>
              ))}
            </NavigationSection>
          )}
        </SidebarContainer>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;