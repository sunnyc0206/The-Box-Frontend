import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const SkeletonWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const SkeletonBlock = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.medium};
  height: ${props => props.height || '20px'};
  width: ${props => props.width || '100%'};
  margin-bottom: ${props => props.marginBottom || '1.5rem'};
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
    animation: ${shimmer} 1.5s infinite;
  }
`;

const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const SkeletonCard = styled(SkeletonBlock)`
  height: 250px; /* Adjust height as needed */
  text-align: center;
`;

const SkeletonLoader = () => {
  return (
    <SkeletonWrapper>
      <SkeletonBlock height="80px" marginBottom="4rem" />
      <SkeletonBlock width="40%" height="30px" />
      <SkeletonGrid>
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </SkeletonGrid>
      <SkeletonBlock width="50%" height="30px" />
      <SkeletonGrid>
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </SkeletonGrid>
    </SkeletonWrapper>
  );
};

export default SkeletonLoader;