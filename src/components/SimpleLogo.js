import React from 'react';
import styled from 'styled-components';

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
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
      case 'large': return '52px';
      default: return '36px';
    }
  }};
  width: auto;
  object-fit: contain;
  max-width: none;
  
  /* Aplicar filtro de cor se necessário */
  ${props => props.color === 'white' && `
    filter: brightness(0) invert(1);
  `}
`;

const SimpleLogo = ({ size = 'medium', color, onClick, className }) => {
  return (
    <LogoContainer onClick={onClick} className={className}>
      <LogoImage 
        src="/logo-maximiza-oficial.svg"
        alt="Maximiza - Soluções Educacionais"
        size={size}
        color={color}
      />
    </LogoContainer>
  );
};

export default SimpleLogo;
