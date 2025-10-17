import React from 'react';
import styled from 'styled-components';
import { FaGraduationCap } from 'react-icons/fa';

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: ${props => props.size === 'small' ? '1.2rem' : '1.5rem'};
  font-weight: 700;
  color: ${props => props.color || 'var(--primary-color)'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const LogoImage = styled.img`
  height: ${props => {
    switch(props.size) {
      case 'small': return '28px';
      case 'large': return '60px';
      default: return '36px';
    }
  }};
  width: auto;
  object-fit: contain;
  max-width: ${props => {
    switch(props.size) {
      case 'small': return '120px';
      case 'large': return '200px';
      default: return '160px';
    }
  }};
`;

const LogoIcon = styled.div`
  svg {
    font-size: ${props => {
      switch(props.size) {
        case 'small': return '1.5rem';
        case 'large': return '2.2rem';
        default: return '1.8rem';
      }
    }};
    color: ${props => props.color || 'var(--secondary-color)'};
  }
`;

const LogoText = styled.span`
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.02em;
`;

const Logo = ({ 
  size = 'medium', 
  color, 
  onClick, 
  showText = false, 
  logoSrc = '/logo-maximiza-oficial.svg',
  alt = 'Maximiza - Soluções Educacionais'
}) => {
  return (
    <LogoContainer size={size} color={color} onClick={onClick}>
      {logoSrc ? (
        <LogoImage src={logoSrc} alt={alt} size={size} />
      ) : (
        <LogoIcon size={size} color={color}>
          <FaGraduationCap />
        </LogoIcon>
      )}
      {showText && <LogoText>MAXIMIZA</LogoText>}
    </LogoContainer>
  );
};

export default Logo;
