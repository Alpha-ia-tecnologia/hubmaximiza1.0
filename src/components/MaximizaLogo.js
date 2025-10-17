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

const LogoSvg = styled.svg`
  height: ${props => {
    switch(props.size) {
      case 'small': return '32px';
      case 'large': return '56px';
      default: return '40px';
    }
  }};
  width: auto;
  min-width: ${props => {
    switch(props.size) {
      case 'small': return '120px';
      case 'large': return '200px';
      default: return '160px';
    }
  }};
  max-width: ${props => {
    switch(props.size) {
      case 'small': return '140px';
      case 'large': return '220px';
      default: return '180px';
    }
  }};
  
  /* Aplicar filtro de cor se necessário */
  ${props => props.color === 'white' && `
    filter: brightness(0) invert(1);
  `}
  
  /* Garantir que o SVG não seja cortado */
  overflow: visible;
`;

const MaximizaLogo = ({ size = 'medium', color, onClick, className }) => {
  return (
    <LogoContainer onClick={onClick} className={className}>
      <LogoSvg
        size={size}
        color={color}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 559.69202 198.39732"
      >
        <defs>
          <clipPath id="clipPath26" clipPathUnits="userSpaceOnUse">
            <path d="M 0,148.798 H 419.769 V 0 H 0 Z" />
          </clipPath>
        </defs>
        <g transform="matrix(1.3333333,0,0,-1.3333333,0,198.39733)">
          <g transform="translate(94.8951,127.1898)">
            <path
              style={{fill: color === 'white' ? '#ffffff' : '#04044c', fillOpacity: 1, fillRule: 'nonzero', stroke: 'none'}}
              d="m 0,0 37.204,-63.755 6.036,10.743 -24.586,42.386 H 30.935 L 55.524,-52.763 12.092,-127.19 h 37.142 l 24.964,43.161 0.022,-0.774 24.735,-42.387 h 11.981 l -37.321,64.326 -30.982,-53.7 H 30.747 L 67.757,-52.763 37.139,0 Z"
            />
          </g>
          <g transform="translate(192.9996,148.7979)">
            <path
              style={{fill: color === 'white' ? '#ffffff' : '#009fe3', fillOpacity: 1, fillRule: 'nonzero', stroke: 'none'}}
              d="m 0,0 -24.963,-43.161 -0.023,0.774 L -49.721,0 h -11.98 l 37.321,-64.326 30.982,53.699 h 11.887 l -37.012,-63.799 30.618,-52.764 h 37.14 L 12.03,-63.435 5.994,-74.178 30.581,-116.563 H 18.3 L -6.289,-74.426 37.143,0 Z"
            />
          </g>
          <g clipPath="url(#clipPath26)">
            <g transform="translate(34.4282,81.2023)">
              <path
                style={{fill: color === 'white' ? '#ffffff' : '#04044c', fillOpacity: 1, fillRule: 'nonzero', stroke: 'none'}}
                d="m 0,0 c 2.669,3.874 7.144,6.887 14.633,6.887 14.201,0 19.796,-10.674 19.796,-18.162 V -36.924 H 24.1 v 25.391 c 0,6.111 -4.475,8.865 -9.467,8.865 -4.993,0 -9.468,-2.754 -9.468,-8.865 V -36.924 H -5.164 v 25.391 c 0,6.111 -4.475,8.865 -9.468,8.865 -4.992,0 -9.468,-2.754 -9.468,-8.865 v -25.391 h -10.328 v 25.649 c 0,7.488 5.594,18.162 19.796,18.162 C -7.144,6.887 -2.668,3.874 0,0"
              />
            </g>
            <g transform="translate(95.0269,78.4486)">
              <path
                style={{fill: color === 'white' ? '#ffffff' : '#04044c', fillOpacity: 1, fillRule: 'nonzero', stroke: 'none'}}
                d="m 0,0 c -7.23,0 -11.965,-4.734 -11.965,-12.738 0,-8.005 4.735,-12.739 11.965,-12.739 7.144,0 11.878,4.734 11.878,12.739 C 11.878,-4.734 7.144,0 0,0 M 22.206,-12.824 V -34.171 H 11.878 v 4.132 c -2.066,-2.668 -6.456,-4.907 -12.739,-4.907 -12.481,0 -21.432,8.953 -21.432,22.293 0,13.255 8.951,22.12 22.206,22.12 13.342,0 22.293,-8.951 22.293,-22.291"
              />
            </g>
            <path
              style={{fill: color === 'white' ? '#ffffff' : '#009fe3', fillOpacity: 1, fillRule: 'nonzero', stroke: 'none'}}
              d="m 234.729,87.314 h 10.328 V 44.278 h -10.328 z m 5.164,18.161 c 3.185,0 5.681,-2.582 5.681,-5.681 0,-3.27 -2.496,-5.766 -5.681,-5.766 -3.184,0 -5.68,2.496 -5.68,5.766 0,3.099 2.496,5.681 5.68,5.681"
            />
            {/* Texto "Soluções Educacionais" */}
            <g transform="translate(252.1783,23.482)">
              <path
                style={{fill: color === 'white' ? '#ffffff' : '#009fe3', fillOpacity: 1, fillRule: 'nonzero', stroke: 'none'}}
                d="m 0,0 0.523,1.102 c 0.735,-0.665 1.992,-1.144 3.263,-1.144 1.71,0 2.445,0.663 2.445,1.525 0,2.416 -5.991,0.891 -5.991,4.563 0,1.526 1.187,2.826 3.786,2.826 1.159,0 2.359,-0.311 3.179,-0.876 L 6.739,6.866 C 5.877,7.416 4.902,7.671 4.026,7.671 2.345,7.671 1.625,6.964 1.625,6.103 1.625,3.686 7.614,5.198 7.614,1.568 7.614,0.056 6.4,-1.243 3.786,-1.243 2.274,-1.243 0.791,-0.735 0,0"
              />
            </g>
          </g>
        </g>
      </LogoSvg>
    </LogoContainer>
  );
};

export default MaximizaLogo;
