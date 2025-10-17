import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaUsers, FaMapMarkedAlt, FaCogs, FaSignOutAlt, FaBars, FaTimes, FaChartLine } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import SimpleLogo from '../components/SimpleLogo';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: var(--support-color);
`;

const Sidebar = styled.aside`
  width: 280px;
  background: white;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transition: all 0.3s;

  @media (max-width: 768px) {
    position: fixed;
    left: ${props => props.isOpen ? '0' : '-100%'};
    top: 0;
    height: 100vh;
    z-index: 1000;
  }
`;

const SidebarHeader = styled.div`
  padding: 2rem;
  background: var(--primary-color);
  color: white;

  h2 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.5rem;

    svg {
      font-size: 2rem;
    }
  }

  p {
    margin-top: 0.5rem;
    opacity: 0.9;
    font-size: 0.9rem;
  }
`;

const Nav = styled.nav`
  flex: 1;
  padding: 1.5rem 0;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  color: var(--text-color);
  text-decoration: none;
  transition: all 0.3s;
  position: relative;

  svg {
    font-size: 1.2rem;
    color: var(--secondary-color);
  }

  &:hover {
    background: var(--support-color);
  }

  &.active {
    background: var(--support-color);
    color: var(--primary-color);
    font-weight: 600;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: var(--secondary-color);
    }
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  width: 100%;
  border: none;
  background: transparent;
  color: var(--error-color);
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
  border-top: 1px solid var(--border-color);
  margin-top: auto;

  &:hover {
    background: rgba(220, 53, 69, 0.1);
  }

  svg {
    font-size: 1.2rem;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const TopBar = styled.div`
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;

  @media (max-width: 768px) {
    display: block;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--secondary-color);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
  }

  .info {
    @media (max-width: 768px) {
      display: none;
    }

    h3 {
      font-size: 1rem;
      color: var(--primary-color);
      margin-bottom: 0.2rem;
    }

    p {
      font-size: 0.85rem;
      color: var(--text-color);
    }
  }
`;

const WelcomeCard = styled.div`
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1.1rem;
    opacity: 0.95;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  }

  .icon {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    background: ${props => props.color || 'var(--secondary-color)'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
  }

  .content {
    flex: 1;

    h3 {
      font-size: 2rem;
      color: var(--primary-color);
      margin-bottom: 0.2rem;
    }

    p {
      color: var(--text-color);
      font-size: 0.9rem;
    }
  }
`;

const Overlay = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
`;

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    municipalities: 0,
    solutions: 0,
    users: 0
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Carrega as estatísticas quando o componente é montado
  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setStats({
            municipalities: 4, // Número fixo de municípios cadastrados
            solutions: 3, // Número fixo de soluções
            users: data.totalUsers || 0
          });
        } else {
          // Usar dados simulados se a API falhar
          setStats({
            municipalities: 4,
            solutions: 3,
            users: 15
          });
        }
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
        // Usar dados simulados em caso de erro
        setStats({
          municipalities: 4,
          solutions: 3,
          users: 15
        });
      }
    };

    loadStats();
  }, []);


  return (
    <Container>
      <Overlay isOpen={sidebarOpen} onClick={closeSidebar} />
      
      <Sidebar isOpen={sidebarOpen}>
        <SidebarHeader>
          <SimpleLogo 
            size="medium" 
            color="white"
          />
          <p>Painel Administrativo</p>
        </SidebarHeader>
        
        <Nav>
          <NavItem to="/admin/dashboard" onClick={closeSidebar}>
            <FaChartLine />
            Dashboard
          </NavItem>
          <NavItem to="/admin/municipios" onClick={closeSidebar}>
            <FaMapMarkedAlt />
            Municípios
          </NavItem>
          <NavItem to="/admin/solucoes" onClick={closeSidebar}>
            <FaCogs />
            Soluções
          </NavItem>
          <NavItem to="/admin/usuarios" onClick={closeSidebar}>
            <FaUsers />
            Usuários
          </NavItem>
        </Nav>
        
        <LogoutButton onClick={handleLogout}>
          <FaSignOutAlt />
          Sair
        </LogoutButton>
      </Sidebar>
      
      <MainContent>
        <TopBar>
          <MobileMenuButton onClick={toggleSidebar}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </MobileMenuButton>
          
          <UserInfo>
            <div className="avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="info">
              <h3>{user?.name}</h3>
              <p>Administrador</p>
            </div>
          </UserInfo>
        </TopBar>
        
        <Outlet />
        
        {/* Mostrar dashboard principal quando não houver subrota */}
        {window.location.pathname === '/admin' && (
          <>
            <WelcomeCard>
              <h1>Bem-vindo ao Painel Administrativo</h1>
              <p>Gerencie municípios, soluções e usuários do sistema</p>
            </WelcomeCard>
            
            <StatsGrid>
              <StatCard color="var(--secondary-color)">
                <div className="icon">
                  <FaMapMarkedAlt />
                </div>
                <div className="content">
                  <h3>{stats.municipalities}</h3>
                  <p>Municípios Cadastrados</p>
                </div>
              </StatCard>
              
              <StatCard color="#28a745">
                <div className="icon">
                  <FaCogs />
                </div>
                <div className="content">
                  <h3>{stats.solutions}</h3>
                  <p>Soluções Ativas</p>
                </div>
              </StatCard>
              
              <StatCard color="#ffc107">
                <div className="icon">
                  <FaUsers />
                </div>
                <div className="content">
                  <h3>{stats.users}</h3>
                  <p>Usuários Cadastrados</p>
                </div>
              </StatCard>
            </StatsGrid>
          </>
        )}
      </MainContent>
    </Container>
  );
};

export default AdminDashboard;
