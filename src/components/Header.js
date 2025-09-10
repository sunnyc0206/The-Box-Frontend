import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { FiSearch, FiMenu, FiSun, FiMoon, FiX } from "react-icons/fi"; // Import FiX
import { motion } from "framer-motion";
import img from "../assets/thebox-logo.png";
import { useUI, useAppDispatch } from "../store/hooks";
import { setTheme } from "../store/slices/uiSlice";
import { setCountrySearchQuery, setSearchQuery } from "../store/slices/searchSlice";

const HeaderContainer = styled.header`
  background: ${(props) => props.theme.colors.surface};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;

  span {
    background: linear-gradient(
      135deg,
      ${(props) => props.theme.colors.primary},
      ${(props) => props.theme.colors.secondary}
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const SearchContainer = styled.div`
  flex: 1;
  max-width: 500px;
  position: relative;
  margin-left: auto;
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
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 1.2rem;
`;

const ClearSearchButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 1.2rem;
  cursor: pointer;
  transition: ${(props) => props.theme.transitions.fast};
  &:hover {
    color: ${(props) => props.theme.colors.text};
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.text};
  font-size: 1.5rem;
  cursor: pointer;
  display: block;
  &:focus {
    outline: none; 
  }
`;

const ThemeToggleButton = styled(motion.button)`
  background: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.text};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.round};
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: ${(props) => props.theme.transitions.fast};
  
  &:hover {
    color: ${(props) => props.theme.colors.primary};
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

const Header = ({ onMenuToggle, sidebarOpen }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { theme } = useUI();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (location.pathname === '/') {
        dispatch(setCountrySearchQuery(searchQuery.trim()));
        // Note: We no longer clear the local state here
        if (searchInputRef.current) {
          searchInputRef.current.blur();
        }
      } else {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        if (searchInputRef.current) {
          searchInputRef.current.blur();
        }
      }
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    dispatch(setCountrySearchQuery(''));
    if (location.pathname !== '/') {
        navigate('/');
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };
  
  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(newTheme));
  };

  return (
    <HeaderContainer>
      <MenuButton onClick={onMenuToggle}>
        <FiMenu />
      </MenuButton>
      <Logo onClick={handleLogoClick}>
        <img
          src={img}
          style={{ height: "90px", width: "100px", borderRadius: "50%" }}
          alt={"The Box"}
        ></img>
      </Logo>

      <SearchContainer>
        <form onSubmit={handleSearch}>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder={location.pathname === '/' ? "Search countries..." : "Search channels..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            ref={searchInputRef}
          />
          {searchQuery && (
            <ClearSearchButton type="button" onClick={handleClearSearch}>
              <FiX />
            </ClearSearchButton>
          )}
        </form>
      </SearchContainer>
      
      <ThemeToggleButton 
        onClick={handleThemeToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {theme === 'light' ? <FiMoon /> : <FiSun />}
      </ThemeToggleButton>
    </HeaderContainer>
  );
};

export default Header;
