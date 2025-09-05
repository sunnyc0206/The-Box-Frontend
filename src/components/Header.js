import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import img from "../assets/thebox-logo.png";

const HeaderContainer = styled.header`
  background: ${(props) => props.theme.colors.surface};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  /* Use flex-start to align items to the left */
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

const SearchButton = styled(motion.button)`
  background: ${(props) => props.theme.colors.primary};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  font-weight: 600;
  transition: ${(props) => props.theme.transitions.fast};

  &:hover {
    background: ${(props) => props.theme.colors.secondary};
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.shadows.medium};
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
`;

const Header = ({ onMenuToggle, sidebarOpen }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      //setSearchQuery('');
      if (searchInputRef.current) {
        searchInputRef.current.blur();
      }
    }
  };

  const handleLogoClick = () => {
    navigate("/");
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
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            ref={searchInputRef}
          />
        </form>
      </SearchContainer>

      {/* <SearchButton
        onClick={handleSearch}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Search
      </SearchButton> */}
    </HeaderContainer>
  );
};

export default Header;
