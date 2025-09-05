import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background: ${props => props.theme.colors.card};
  color: ${props => props.theme.colors.text};
  padding: 2rem;
  border-radius: ${props => props.theme.borderRadius.large};
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: ${props => props.theme.shadows.medium};
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const ModalMessage = styled.p`
  font-size: 1rem;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ModalButton = styled(motion.button)`
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-weight: 600;
  transition: ${props => props.theme.transitions.fast};
  cursor: pointer;
  border: none;
  
  &:hover {
    background: ${props => props.theme.colors.secondary};
  }
`;

const ErrorModal = ({ message, onRefresh }) => {
  return (
    <ModalOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ModalContent
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <ModalTitle>Sorry :(</ModalTitle>
        <ModalTitle>It's not you, it's us. </ModalTitle><br></br>
        <ModalMessage>{message}</ModalMessage>
        <ModalButton
          onClick={onRefresh}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Refresh
        </ModalButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ErrorModal;