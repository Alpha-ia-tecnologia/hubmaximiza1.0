import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaGraduationCap, FaChartLine, FaUsers, FaLaptopCode, 
  FaAward, FaPhone, FaEnvelope, FaCheckCircle, 
  FaBook, FaBars, FaTimes, FaArrowRight, FaQuoteLeft,
  FaLinkedin, FaFacebook, FaInstagram, FaYoutube
} from 'react-icons/fa';
import SimpleLogo from '../components/SimpleLogo';

// ========== Container & Layout Components ==========
const Container = styled.div`
  width: 100%;
  overflow-x: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

// ========== Header Components ==========
const Header = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  transition: all 0.3s ease;

  &.scrolled {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

const Nav = styled.nav`
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.2rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;


const NavMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 2.5rem;

  @media (max-width: 968px) {
    position: fixed;
    left: ${props => props.isOpen ? '0' : '-100%'};
    top: 0;
    width: 100%;
    height: 100vh;
    background: white;
    flex-direction: column;
    justify-content: center;
    transition: 0.3s;
    box-shadow: ${props => props.isOpen ? '0 0 50px rgba(0,0,0,0.1)' : 'none'};
    z-index: 999;
  }
`;

const NavLink = styled.a`
  color: #4a5568;
  font-weight: 500;
  font-size: 0.95rem;
  text-decoration: none;
  transition: color 0.3s;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--secondary-color);
    transition: width 0.3s;
  }

  &:hover {
    color: var(--primary-color);
    
    &::after {
      width: 100%;
    }
  }

  @media (max-width: 968px) {
    font-size: 1.2rem;
  }
`;

const CTAButton = styled.button`
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 169, 232, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(0, 169, 232, 0.4);
  }

  @media (max-width: 968px) {
    padding: 1rem 2.5rem;
    font-size: 1.1rem;
  }
`;

const MobileMenuToggle = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--primary-color);
  cursor: pointer;
  z-index: 1001;

  @media (max-width: 968px) {
    display: block;
  }
`;

const CloseButton = styled.button`
  display: none;
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: none;
  border: none;
  font-size: 1.8rem;
  color: var(--primary-color);
  cursor: pointer;

  @media (max-width: 968px) {
    display: block;
  }
`;

// ========== Hero Section ==========
const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 120px 2rem 80px;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -100px;
    right: -100px;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(0, 169, 232, 0.1) 0%, transparent 70%);
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -150px;
    left: -150px;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(12, 44, 104, 0.05) 0%, transparent 70%);
    border-radius: 50%;
  }

  @media (max-width: 768px) {
    padding: 100px 1rem 60px;
  }
`;

const HeroContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const HeroContent = styled.div`
  h1 {
    font-size: 3.5rem;
    font-weight: 800;
    color: var(--primary-color);
    line-height: 1.2;
    margin-bottom: 1.5rem;

    span {
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }

  p {
    font-size: 1.25rem;
    color: #4a5568;
    line-height: 1.8;
    margin-bottom: 2.5rem;

    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 10px 30px rgba(0, 169, 232, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(0, 169, 232, 0.4);
  }

  svg {
    transition: transform 0.3s;
  }

  &:hover svg {
    transform: translateX(5px);
  }
`;

const SecondaryButton = styled.button`
  background: white;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  padding: 1rem 2.5rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: var(--primary-color);
    color: white;
    transform: translateY(-3px);
  }
`;

const HeroImage = styled.div`
  position: relative;
  
  img {
    width: 100%;
    height: auto;
    border-radius: 20px;
  }

  @media (max-width: 968px) {
    display: none;
  }
`;

const HeroGraphic = styled.div`
  width: 100%;
  height: 500px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 150%;
    height: 150%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: pulse 4s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  svg {
    font-size: 8rem;
    color: rgba(255, 255, 255, 0.9);
    z-index: 1;
  }
`;

// ========== Stats Section ==========
const StatsSection = styled.section`
  padding: 5rem 2rem;
  background: white;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
`;

const StatsContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3rem;

  @media (max-width: 968px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatItem = styled.div`
  text-align: center;

  h3 {
    font-size: 3rem;
    font-weight: 800;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.5rem;
  }

  p {
    color: #4a5568;
    font-size: 1.1rem;
    font-weight: 500;
  }
`;

// ========== About Section ==========
const AboutSection = styled.section`
  padding: 6rem 2rem;
  background: #f8fafc;
`;

const SectionContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;

  h2 {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--primary-color);
    margin-bottom: 1rem;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.2rem;
    color: #4a5568;
    max-width: 700px;
    margin: 0 auto;
    line-height: 1.8;
  }
`;

const AboutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const AboutContent = styled.div`
  h3 {
    font-size: 2rem;
    color: var(--primary-color);
    margin-bottom: 1.5rem;
    font-weight: 700;
  }

  p {
    color: #4a5568;
    line-height: 1.8;
    margin-bottom: 2rem;
    font-size: 1.1rem;
  }
`;

const AboutFeatures = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;

  .icon {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    svg {
      color: white;
      font-size: 1.3rem;
    }
  }

  .content {
    h4 {
      color: var(--primary-color);
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    p {
      color: #4a5568;
      line-height: 1.6;
      font-size: 0.95rem;
    }
  }
`;

// ========== Solutions Section ==========
const SolutionsSection = styled.section`
  padding: 6rem 2rem;
  background: white;
`;

const SolutionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const SolutionCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 2.5rem;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  }

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  .icon {
    width: 70px;
    height: 70px;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;

    svg {
      color: white;
      font-size: 2rem;
    }
  }

  h3 {
    color: var(--primary-color);
    font-size: 1.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
  }

  p {
    color: #4a5568;
    line-height: 1.8;
    margin-bottom: 1.5rem;
  }

  ul {
    list-style: none;
    margin-bottom: 2rem;

    li {
      padding: 0.5rem 0;
      color: #4a5568;
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      font-size: 0.95rem;

      svg {
        color: var(--secondary-color);
        flex-shrink: 0;
        margin-top: 3px;
      }
    }
  }

  button {
    width: 100%;
    background: transparent;
    color: var(--primary-color);
    border: 2px solid var(--primary-color);
    padding: 0.75rem;
    border-radius: 50px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: var(--primary-color);
      color: white;
    }
  }
`;

// ========== BNCC/SAEB Section ==========
const AlignmentSection = styled.section`
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
`;

const AlignmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
  margin-top: 3rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const AlignmentCard = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${props => props.gradient};
    opacity: 0.03;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;

    .badge {
      background: ${props => props.badgeColor};
      color: white;
      padding: 0.5rem 1.5rem;
      border-radius: 50px;
      font-weight: 700;
      font-size: 0.9rem;
    }
  }

  h3 {
    color: var(--primary-color);
    font-size: 1.8rem;
    margin-bottom: 1rem;
    font-weight: 700;
  }

  p {
    color: #4a5568;
    line-height: 1.8;
    margin-bottom: 2rem;
    font-size: 1.1rem;
  }

  ul {
    list-style: none;

    li {
      padding: 0.75rem 0;
      color: #4a5568;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      font-size: 1rem;
      border-bottom: 1px solid #e2e8f0;

      &:last-child {
        border-bottom: none;
      }

      svg {
        color: ${props => props.iconColor};
        flex-shrink: 0;
        margin-top: 3px;
      }
    }
  }
`;

// ========== Testimonials Section ==========
const TestimonialsSection = styled.section`
  padding: 6rem 2rem;
  background: white;
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const TestimonialCard = styled.div`
  background: #f8fafc;
  padding: 2rem;
  border-radius: 16px;
  position: relative;

  svg {
    color: var(--secondary-color);
    font-size: 2rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  p {
    color: #4a5568;
    line-height: 1.8;
    font-style: italic;
    margin-bottom: 1.5rem;
  }

  .author {
    display: flex;
    align-items: center;
    gap: 1rem;

    .avatar {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
    }

    .info {
      h4 {
        color: var(--primary-color);
        font-weight: 600;
        margin-bottom: 0.2rem;
      }

      span {
        color: #718096;
        font-size: 0.9rem;
      }
    }
  }
`;

// ========== CTA Section ==========
const CTASection = styled.section`
  padding: 6rem 2rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: float 20s linear infinite;
  }

  @keyframes float {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }
`;

const CTADecoration = () => (
  <svg 
    style={{ 
      position: 'absolute', 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)', 
      width: '800px', 
      height: '400px', 
      opacity: 0.1,
      pointerEvents: 'none' 
    }} 
    viewBox="0 0 800 400" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="100" cy="100" r="50" fill="white"/>
    <circle cx="700" cy="300" r="70" fill="white"/>
    <rect x="350" y="150" width="100" height="100" rx="20" fill="white" transform="rotate(45 400 200)"/>
    <path d="M200 200 L250 250 L300 200" stroke="white" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M500 100 L550 150 L600 100" stroke="white" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CTAContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  h2 {
    font-size: 2.5rem;
    color: white;
    margin-bottom: 1rem;
    font-weight: 800;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.3rem;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 2rem;
    line-height: 1.8;
  }

  button {
    background: white;
    color: var(--primary-color);
    border: none;
    padding: 1.2rem 3rem;
    border-radius: 50px;
    font-weight: 700;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
    }
  }
`;

// ========== Footer ==========
const Footer = styled.footer`
  background: #1a202c;
  color: white;
  padding: 4rem 2rem 2rem;
`;

const FooterContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const FooterColumn = styled.div`
  h3 {
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
    color: white;
  }

  p {
    color: #a0aec0;
    line-height: 1.8;
    margin-bottom: 1.5rem;
  }

  ul {
    list-style: none;

    li {
      margin-bottom: 0.75rem;

      a {
        color: #a0aec0;
        text-decoration: none;
        transition: color 0.3s;

        &:hover {
          color: var(--secondary-color);
        }
      }
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;

  a {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;

    svg {
      color: white;
      font-size: 1.2rem;
    }

    &:hover {
      background: var(--secondary-color);
      transform: translateY(-3px);
    }
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #a0aec0;
`;

// ========== Main Component ==========
const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <Container>
      <Header className={scrolled ? 'scrolled' : ''}>
        <Nav>
          <SimpleLogo 
            size="medium" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          />
          
          <NavMenu isOpen={mobileMenuOpen}>
            <CloseButton onClick={() => setMobileMenuOpen(false)}>
              <FaTimes />
            </CloseButton>
            <NavLink href="#sobre" onClick={(e) => { e.preventDefault(); scrollToSection('sobre'); }}>
              Sobre
            </NavLink>
            <NavLink href="#solucoes" onClick={(e) => { e.preventDefault(); scrollToSection('solucoes'); }}>
              Soluções
            </NavLink>
            <NavLink href="#diferenciais" onClick={(e) => { e.preventDefault(); scrollToSection('diferenciais'); }}>
              Diferenciais
            </NavLink>
            <NavLink href="#depoimentos" onClick={(e) => { e.preventDefault(); scrollToSection('depoimentos'); }}>
              Depoimentos
            </NavLink>
            <CTAButton onClick={() => navigate('/login')}>
              Acessar Plataforma
            </CTAButton>
          </NavMenu>
          
          <MobileMenuToggle onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </MobileMenuToggle>
        </Nav>
      </Header>

      <HeroSection>
        <HeroContainer>
          <HeroContent>
            <h1>
              Transforme a Educação com <span>Tecnologia e Inovação</span>
            </h1>
            <p>
              Soluções educacionais completas, alinhadas à BNCC e SAEB, 
              para elevar a qualidade do ensino e potencializar o aprendizado 
              dos seus alunos.
            </p>
            <HeroButtons>
              <PrimaryButton onClick={() => scrollToSection('solucoes')}>
                Conheça as Soluções
                <FaArrowRight />
              </PrimaryButton>
              <SecondaryButton onClick={() => scrollToSection('contato')}>
                Fale Conosco
              </SecondaryButton>
            </HeroButtons>
          </HeroContent>
          
          <HeroImage>
            <svg viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxWidth: '500px' }}>
              {/* Background decorations */}
              <circle cx="400" cy="100" r="60" fill="url(#grad1)" opacity="0.2"/>
              <circle cx="100" cy="300" r="80" fill="url(#grad2)" opacity="0.15"/>
              
              {/* Main laptop illustration */}
              <g transform="translate(120, 120)">
                <rect x="0" y="50" width="260" height="160" rx="10" fill="#1e293b"/>
                <rect x="10" y="60" width="240" height="130" rx="5" fill="#0c2c68"/>
                <rect x="25" y="75" width="210" height="100" rx="3" fill="#ffffff"/>
                
                {/* Screen content */}
                <rect x="40" y="90" width="60" height="8" rx="4" fill="#00a9e8"/>
                <rect x="40" y="105" width="180" height="6" rx="3" fill="#e2e8f0"/>
                <rect x="40" y="118" width="140" height="6" rx="3" fill="#e2e8f0"/>
                <rect x="40" y="131" width="160" height="6" rx="3" fill="#e2e8f0"/>
                
                {/* Laptop base */}
                <path d="M-20 210 L280 210 L260 230 L0 230 Z" fill="#94a3b8"/>
              </g>
              
              {/* Floating UI elements */}
              <g transform="translate(50, 50)">
                <rect width="80" height="80" rx="15" fill="#22c55e" opacity="0.9"/>
                <path d="M40 25 L40 55 M25 40 L55 40" stroke="white" strokeWidth="4" strokeLinecap="round"/>
              </g>
              
              <g transform="translate(380, 160)">
                <circle cx="40" cy="40" r="40" fill="#f59e0b" opacity="0.9"/>
                <path d="M40 25 L40 45 M40 55 L40.5 55.5" stroke="white" strokeWidth="4" strokeLinecap="round"/>
              </g>
              
              <g transform="translate(350, 280)">
                <rect width="70" height="70" rx="35" fill="#8b5cf6" opacity="0.9"/>
                <path d="M20 35 L30 45 L50 25" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              
              {/* Books stack */}
              <g transform="translate(60, 250)">
                <rect x="0" y="20" width="50" height="70" rx="3" fill="#0c2c68" transform="rotate(-10 25 55)"/>
                <rect x="15" y="15" width="50" height="70" rx="3" fill="#00a9e8" transform="rotate(-5 40 50)"/>
                <rect x="30" y="10" width="50" height="70" rx="3" fill="#22c55e"/>
                <text x="45" y="50" fill="white" fontFamily="Arial" fontSize="12" fontWeight="bold">ABC</text>
              </g>
              
              {/* Floating particles */}
              <circle cx="150" cy="80" r="3" fill="#00a9e8" opacity="0.6"/>
              <circle cx="320" cy="120" r="3" fill="#22c55e" opacity="0.6"/>
              <circle cx="420" cy="250" r="3" fill="#f59e0b" opacity="0.6"/>
              <circle cx="180" cy="320" r="3" fill="#8b5cf6" opacity="0.6"/>
              
              {/* Gradients */}
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0c2c68"/>
                  <stop offset="100%" stopColor="#00a9e8"/>
                </linearGradient>
                <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00a9e8"/>
                  <stop offset="100%" stopColor="#22c55e"/>
                </linearGradient>
              </defs>
            </svg>
          </HeroImage>
        </HeroContainer>
      </HeroSection>

      <StatsSection>
        <StatsContainer>
          <StatItem>
            <h3>10k+</h3>
            <p>Alunos Impactados</p>
          </StatItem>
          <StatItem>
            <h3>100+</h3>
            <p>Escolas Parceiras</p>
          </StatItem>
          <StatItem>
            <h3>98%</h3>
            <p>Taxa de Satisfação</p>
          </StatItem>
          <StatItem>
            <h3>3</h3>
            <p>Soluções Integradas</p>
          </StatItem>
        </StatsContainer>
      </StatsSection>

      <AboutSection id="sobre">
        <SectionContainer>
          <SectionHeader>
            <h2>Sobre a Maximiza</h2>
            <p>
              Líderes em soluções educacionais tecnológicas, transformando 
              o futuro da educação brasileira.
            </p>
          </SectionHeader>
          
          <AboutGrid>
            <AboutContent>
              <h3>Nossa Missão é Democratizar a Educação de Qualidade</h3>
              <p>
                A Maximiza nasceu com o propósito de revolucionar a educação através 
                da tecnologia. Com anos de experiência e expertise no setor educacional, 
                desenvolvemos soluções que atendem às necessidades reais de gestores, 
                professores e alunos.
              </p>
              <p>
                Nosso compromisso é com resultados mensuráveis e o desenvolvimento 
                integral dos estudantes, preparando-os para os desafios do século XXI.
              </p>
            </AboutContent>
            
            <AboutFeatures>
              <FeatureItem>
                <div className="icon">
                  <FaAward />
                </div>
                <div className="content">
                  <h4>Excelência Comprovada</h4>
                  <p>Resultados superiores em avaliações oficiais e indicadores educacionais.</p>
                </div>
              </FeatureItem>
              
              <FeatureItem>
                <div className="icon">
                  <FaChartLine />
                </div>
                <div className="content">
                  <h4>Dados e Análises</h4>
                  <p>Relatórios detalhados para tomada de decisão baseada em evidências.</p>
                </div>
              </FeatureItem>
              
              <FeatureItem>
                <div className="icon">
                  <FaUsers />
                </div>
                <div className="content">
                  <h4>Suporte Especializado</h4>
                  <p>Equipe dedicada ao sucesso da sua instituição educacional.</p>
                </div>
              </FeatureItem>
            </AboutFeatures>
          </AboutGrid>
        </SectionContainer>
      </AboutSection>

      <SolutionsSection id="solucoes">
        <SectionContainer>
          <SectionHeader>
            <h2>Nossas Soluções</h2>
            <p>
              Ferramentas completas e integradas para transformar a gestão 
              e o processo de ensino-aprendizagem.
            </p>
          </SectionHeader>
          
          <SolutionsGrid>
            <SolutionCard>
              <div className="icon">
                <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="35" height="35">
                  <path d="M15 10 L15 50 L45 50 L45 10 Z" fill="white" stroke="white" strokeWidth="2"/>
                  <path d="M20 20 L40 20" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M20 30 L40 30" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M20 40 L35 40" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  <circle cx="45" cy="15" r="8" fill="#fbbf24" stroke="white" strokeWidth="2"/>
                  <path d="M42 15 L44 17 L48 13" stroke="#0c2c68" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>SALF</h3>
              <p>
                Sistema de Avaliação de Fluência em Leitura com diagnósticos 
                precisos e acompanhamento individualizado.
              </p>
              <ul>
                <li>
                  <FaCheckCircle />
                  Avaliação por níveis de proficiência
                </li>
                <li>
                  <FaCheckCircle />
                  Relatórios alinhados ao SAEB
                </li>
                <li>
                  <FaCheckCircle />
                  Banco de atividades BNCC
                </li>
                <li>
                  <FaCheckCircle />
                  Acompanhamento em tempo real
                </li>
              </ul>
              <button onClick={() => scrollToSection('contato')}>
                Saiba Mais
              </button>
            </SolutionCard>
            
            <SolutionCard>
              <div className="icon">
                <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="35" height="35">
                  <rect x="10" y="35" width="8" height="15" fill="white" rx="2"/>
                  <rect x="20" y="25" width="8" height="25" fill="white" rx="2"/>
                  <rect x="30" y="20" width="8" height="30" fill="white" rx="2"/>
                  <rect x="40" y="15" width="8" height="35" fill="white" rx="2"/>
                  <path d="M10 30 L18 20 L28 25 L38 10 L48 15" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="48" cy="15" r="3" fill="#fbbf24"/>
                </svg>
              </div>
              <h3>SAG</h3>
              <p>
                Sistema de Avaliação e Gerenciamento para gestão completa 
                do desempenho escolar.
              </p>
              <ul>
                <li>
                  <FaCheckCircle />
                  Avaliações diagnósticas
                </li>
                <li>
                  <FaCheckCircle />
                  Dashboard analítico completo
                </li>
                <li>
                  <FaCheckCircle />
                  Simulados preparatórios
                </li>
                <li>
                  <FaCheckCircle />
                  Indicadores de desempenho
                </li>
              </ul>
              <button onClick={() => scrollToSection('contato')}>
                Saiba Mais
              </button>
            </SolutionCard>
            
            <SolutionCard>
              <div className="icon">
                <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="35" height="35">
                  <rect x="12" y="15" width="36" height="25" rx="3" fill="white" stroke="white" strokeWidth="2"/>
                  <rect x="17" y="20" width="26" height="15" rx="2" fill="#0c2c68" opacity="0.3"/>
                  <path d="M22 25 L26 29 L22 33" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M30 33 L35 33" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <rect x="20" y="40" width="20" height="3" rx="1" fill="white"/>
                  <circle cx="45" cy="20" r="8" fill="#22c55e" opacity="0.9"/>
                  <path d="M45 16 L45 24 M41 20 L49 20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Pensamento Computacional</h3>
              <p>
                Material estruturado para desenvolvimento de competências 
                digitais do infantil ao 9º ano.
              </p>
              <ul>
                <li>
                  <FaCheckCircle />
                  100% alinhado à BNCC
                </li>
                <li>
                  <FaCheckCircle />
                  Material didático completo
                </li>
                <li>
                  <FaCheckCircle />
                  Formação de professores
                </li>
                <li>
                  <FaCheckCircle />
                  Atividades práticas
                </li>
              </ul>
              <button onClick={() => scrollToSection('contato')}>
                Saiba Mais
              </button>
            </SolutionCard>
          </SolutionsGrid>
        </SectionContainer>
      </SolutionsSection>

      <AlignmentSection id="diferenciais">
        <SectionContainer>
          <SectionHeader>
            <h2>Alinhamento com BNCC e SAEB</h2>
            <p>
              Nossas soluções seguem rigorosamente as diretrizes nacionais, 
              garantindo conformidade e resultados.
            </p>
          </SectionHeader>
          
          <AlignmentGrid>
            <AlignmentCard 
              gradient="linear-gradient(135deg, #0c2c68, #00a9e8)"
              badgeColor="var(--primary-color)"
              iconColor="var(--primary-color)"
            >
              <div className="header">
                <span className="badge">BNCC</span>
              </div>
              <h3>Base Nacional Comum Curricular</h3>
              <p>
                Total conformidade com as competências e habilidades estabelecidas 
                pela BNCC para cada etapa de ensino.
              </p>
              <ul>
                <li>
                  <FaCheckCircle />
                  10 competências gerais desenvolvidas
                </li>
                <li>
                  <FaCheckCircle />
                  Habilidades mapeadas por componente
                </li>
                <li>
                  <FaCheckCircle />
                  Progressão de aprendizagem clara
                </li>
                <li>
                  <FaCheckCircle />
                  Objetos de conhecimento organizados
                </li>
              </ul>
            </AlignmentCard>
            
            <AlignmentCard 
              gradient="linear-gradient(135deg, #28a745, #00a9e8)"
              badgeColor="#28a745"
              iconColor="#28a745"
            >
              <div className="header">
                <span className="badge">SAEB</span>
              </div>
              <h3>Sistema de Avaliação da Educação Básica</h3>
              <p>
                Preparação completa para avaliações externas com foco na 
                melhoria contínua dos indicadores.
              </p>
              <ul>
                <li>
                  <FaCheckCircle />
                  Simulados no padrão oficial
                </li>
                <li>
                  <FaCheckCircle />
                  Análise por descritores
                </li>
                <li>
                  <FaCheckCircle />
                  Relatórios de proficiência
                </li>
                <li>
                  <FaCheckCircle />
                  Acompanhamento do IDEB
                </li>
              </ul>
            </AlignmentCard>
          </AlignmentGrid>
        </SectionContainer>
      </AlignmentSection>

      <TestimonialsSection id="depoimentos">
        <SectionContainer>
          <SectionHeader>
            <h2>O Que Dizem Sobre Nós</h2>
            <p>
              Depoimentos de gestores e educadores que transformaram suas instituições 
              com a Maximiza.
            </p>
          </SectionHeader>
          
          <TestimonialsGrid>
            <TestimonialCard>
              <FaQuoteLeft />
              <p>
                "A Maximiza revolucionou nossa gestão escolar. Os resultados 
                nas avaliações melhoraram significativamente e o engajamento 
                dos professores aumentou."
              </p>
              <div className="author">
                <div className="avatar">
                  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="50" height="50">
                    <circle cx="30" cy="30" r="30" fill="#fef3c7"/>
                    <path d="M30 35 C20 35 15 40 15 50 L45 50 C45 40 40 35 30 35 Z" fill="#f59e0b"/>
                    <circle cx="30" cy="25" r="10" fill="#fbbf24"/>
                    <path d="M20 20 C20 15 22 10 30 10 C38 10 40 15 40 20 L40 25 C40 25 38 28 30 28 C22 28 20 25 20 25 Z" fill="#92400e"/>
                    <circle cx="25" cy="25" r="1.5" fill="#1f2937"/>
                    <circle cx="35" cy="25" r="1.5" fill="#1f2937"/>
                    <path d="M25 32 Q30 34 35 32" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                  </svg>
                </div>
                <div className="info">
                  <h4>Maria Silva</h4>
                  <span>Diretora Escolar</span>
                </div>
              </div>
            </TestimonialCard>
            
            <TestimonialCard>
              <FaQuoteLeft />
              <p>
                "As ferramentas de avaliação são intuitivas e os relatórios 
                nos ajudam a tomar decisões mais assertivas. Excelente 
                investimento!"
              </p>
              <div className="author">
                <div className="avatar">
                  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="50" height="50">
                    <circle cx="30" cy="30" r="30" fill="#dbeafe"/>
                    <path d="M30 35 C20 35 15 40 15 50 L45 50 C45 40 40 35 30 35 Z" fill="#3b82f6"/>
                    <circle cx="30" cy="25" r="10" fill="#93c5fd"/>
                    <path d="M20 22 C20 17 22 12 30 12 C38 12 40 17 40 22 L40 25 C40 25 38 28 30 28 C22 28 20 25 20 25 Z" fill="#374151"/>
                    <circle cx="25" cy="25" r="1.5" fill="#1f2937"/>
                    <circle cx="35" cy="25" r="1.5" fill="#1f2937"/>
                    <path d="M25 32 Q30 34 35 32" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                    <rect x="20" y="30" width="2" height="5" fill="#6b7280" rx="1"/>
                    <rect x="38" y="30" width="2" height="5" fill="#6b7280" rx="1"/>
                  </svg>
                </div>
                <div className="info">
                  <h4>João Oliveira</h4>
                  <span>Coordenador Pedagógico</span>
                </div>
              </div>
            </TestimonialCard>
            
            <TestimonialCard>
              <FaQuoteLeft />
              <p>
                "O suporte da equipe é excepcional. Sempre prontos para 
                ajudar e com soluções práticas para nossos desafios 
                educacionais."
              </p>
              <div className="author">
                <div className="avatar">
                  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="50" height="50">
                    <circle cx="30" cy="30" r="30" fill="#fce7f3"/>
                    <path d="M30 35 C20 35 15 40 15 50 L45 50 C45 40 40 35 30 35 Z" fill="#ec4899"/>
                    <circle cx="30" cy="25" r="10" fill="#f9a8d4"/>
                    <path d="M20 20 C20 15 22 10 30 10 C38 10 40 15 40 20 L40 25 C40 25 38 28 30 28 C22 28 20 25 20 25 Z" fill="#be185d"/>
                    <circle cx="25" cy="25" r="1.5" fill="#1f2937"/>
                    <circle cx="35" cy="25" r="1.5" fill="#1f2937"/>
                    <path d="M25 32 Q30 34 35 32" stroke="#db2777" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                    <circle cx="30" cy="12" r="3" fill="#fbbf24"/>
                  </svg>
                </div>
                <div className="info">
                  <h4>Ana Costa</h4>
                  <span>Secretária de Educação</span>
                </div>
              </div>
            </TestimonialCard>
          </TestimonialsGrid>
        </SectionContainer>
      </TestimonialsSection>

      <CTASection>
        <CTADecoration />
        <CTAContent>
          <h2>Pronto para Transformar sua Instituição?</h2>
          <p>
            Junte-se a centenas de escolas que já revolucionaram 
            seu processo educacional com a Maximiza.
          </p>
          <button onClick={() => scrollToSection('contato')}>
            Solicite uma Demonstração
          </button>
        </CTAContent>
      </CTASection>

      <Footer id="contato">
        <FooterContent>
          <FooterColumn>
            <SimpleLogo 
              size="medium" 
              color="white"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />
            <p>
              Transformando a educação brasileira através da tecnologia 
              e inovação, com soluções alinhadas às diretrizes nacionais.
            </p>
            <SocialLinks>
              <a href="#" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="#" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="#" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" aria-label="YouTube">
                <FaYoutube />
              </a>
            </SocialLinks>
          </FooterColumn>
          
          <FooterColumn>
            <h3>Soluções</h3>
            <ul>
              <li><a href="#salf">SALF</a></li>
              <li><a href="#sag">SAG</a></li>
              <li><a href="#pc">Pensamento Computacional</a></li>
              <li><a href="#formacao">Formação Continuada</a></li>
            </ul>
          </FooterColumn>
          
          <FooterColumn>
            <h3>Institucional</h3>
            <ul>
              <li><a href="#sobre">Sobre Nós</a></li>
              <li><a href="#parceiros">Parceiros</a></li>
              <li><a href="#casos">Casos de Sucesso</a></li>
              <li><a href="#blog">Blog</a></li>
            </ul>
          </FooterColumn>
          
          <FooterColumn>
            <h3>Contato</h3>
            <ul>
              <li>
                <FaPhone style={{ marginRight: '8px', fontSize: '0.9rem' }} />
                (98) 3333-3333
              </li>
              <li>
                <FaEnvelope style={{ marginRight: '8px', fontSize: '0.9rem' }} />
                contato@maximiza.com.br
              </li>
              <li>São Luís - MA</li>
            </ul>
          </FooterColumn>
        </FooterContent>
        
        <FooterBottom>
          <p>© 2025 Maximiza Soluções Educacionais. Todos os direitos reservados.</p>
        </FooterBottom>
      </Footer>
    </Container>
  );
};

export default LandingPage;