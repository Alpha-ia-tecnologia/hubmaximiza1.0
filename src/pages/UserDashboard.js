import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaGraduationCap, FaSignOutAlt, FaUser, FaExternalLinkAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import SimpleLogo from '../components/SimpleLogo';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    animation: float 20s linear infinite;
  }

  @keyframes float {
    0% { transform: translate(0, 0); }
    100% { transform: translate(-50%, -50%); }
  }
`;

const Header = styled.header`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 10;
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;


const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    border: 2px solid white;
  }

  .details {
    @media (max-width: 768px) {
      display: none;
    }

    .name {
      font-weight: 600;
    }

    .municipality {
      font-size: 0.85rem;
      opacity: 0.9;
    }
  }
`;

const MenuButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }

  svg {
    font-size: 1.1rem;
  }
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const WelcomeSection = styled.div`
  text-align: center;
  color: white;
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.2rem;
    opacity: 0.95;
  }
`;

const SolutionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SolutionCard = styled.a`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  }

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);

    .arrow {
      transform: translateX(5px);
    }
  }

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  h3 {
    color: var(--primary-color);
    font-size: 1.5rem;
    margin-bottom: 0.75rem;
  }

  p {
    color: var(--text-color);
    line-height: 1.6;
    flex: 1;
  }

  .link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--secondary-color);
    font-weight: 600;
    margin-top: 1.5rem;

    .arrow {
      transition: transform 0.3s;
    }
  }
`;

const EmptyState = styled.div`
  background: white;
  border-radius: 16px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  svg {
    font-size: 4rem;
    color: var(--secondary-color);
    margin-bottom: 1.5rem;
  }

  h2 {
    color: var(--primary-color);
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }

  p {
    color: var(--text-color);
    font-size: 1.1rem;
    line-height: 1.6;
    max-width: 500px;
    margin: 0 auto;
  }
`;

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserSolutions();
  }, []);

  const fetchUserSolutions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/dashboard/user-dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSolutions(data.solutions || []);
      } else {
        console.error('Erro ao buscar soluções');
        setSolutions([]);
      }
    } catch (error) {
      console.error('Erro ao buscar soluções:', error);
      setSolutions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfile = () => {
    navigate('/perfil');
  };


  return (
    <Container>
      <Header>
        <Nav>
          <SimpleLogo 
            size="medium" 
            color="white"
          />
          <UserMenu>
            <UserInfo>
              <div className="avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="details">
                <div className="name">{user?.name}</div>
                <div className="municipality">{user?.municipality}</div>
              </div>
            </UserInfo>
            <MenuButton onClick={handleProfile}>
              <FaUser />
              Perfil
            </MenuButton>
            <MenuButton onClick={handleLogout}>
              <FaSignOutAlt />
              Sair
            </MenuButton>
          </UserMenu>
        </Nav>
      </Header>

      <MainContent>
        <WelcomeSection>
          <h1>Bem-vindo(a), {user?.name?.split(' ')[0]}!</h1>
          <p>Acesse suas soluções educacionais abaixo</p>
        </WelcomeSection>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Carregando soluções...</p>
          </div>
        ) : solutions.length > 0 ? (
          <SolutionsGrid>
            {solutions.map(solution => (
              <SolutionCard
                key={solution.id}
                href={solution.url || `https://${solution.name.toLowerCase()}.maximiza.com.br`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="icon">{solution.icon || '📚'}</div>
                <h3>{solution.name}</h3>
                <p>{solution.description}</p>
                <div className="link">
                  Acessar {solution.name}
                  <FaExternalLinkAlt className="arrow" />
                </div>
              </SolutionCard>
            ))}
          </SolutionsGrid>
        ) : (
          <EmptyState>
            <FaGraduationCap />
            <h2>Nenhuma solução disponível</h2>
            <p>
              No momento, não há soluções educacionais liberadas para você.
              Entre em contato com o administrador do sistema para solicitar acesso.
            </p>
          </EmptyState>
        )}
      </MainContent>
    </Container>
  );
};

export default UserDashboard;
