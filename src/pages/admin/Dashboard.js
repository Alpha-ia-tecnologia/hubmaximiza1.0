import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../utils/api';
import { 
  FaUsers, FaChartLine, 
  FaUserCheck, FaUserClock, FaEye, FaClock,
  FaArrowUp, FaBook, FaLaptopCode,
  FaCalendarAlt, FaChartBar, FaChartPie
} from 'react-icons/fa';

// ========== Styled Components ==========
const Container = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
    font-weight: 700;
  }

  p {
    color: #6b7280;
    font-size: 1.1rem;
  }
`;

const DateFilter = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterButton = styled.button`
  background: ${props => props.active ? 'var(--primary-color)' : 'white'};
  color: ${props => props.active ? 'white' : '#6b7280'};
  border: 1px solid ${props => props.active ? 'var(--primary-color)' : '#e5e7eb'};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;

  &:hover {
    background: ${props => props.active ? 'var(--secondary-color)' : '#f3f4f6'};
    border-color: var(--secondary-color);
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
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  border: 1px solid #e5e7eb;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;

    .icon {
      width: 50px;
      height: 50px;
      background: ${props => props.iconBg || 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))'};
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
    }

    .trend {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.3rem 0.6rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      background: ${props => props.trend === 'up' ? '#d4f4dd' : '#ffd4d4'};
      color: ${props => props.trend === 'up' ? '#22c55e' : '#ef4444'};

      svg {
        font-size: 0.8rem;
      }
    }
  }

  h3 {
    font-size: 2rem;
    color: var(--primary-color);
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  p {
    color: #6b7280;
    font-size: 0.95rem;
  }

  .subtitle {
    color: #9ca3af;
    font-size: 0.85rem;
    margin-top: 0.5rem;
  }
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;

    h3 {
      color: var(--primary-color);
      font-size: 1.3rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      svg {
        color: var(--secondary-color);
      }
    }

    .legend {
      display: flex;
      gap: 1rem;
      font-size: 0.85rem;

      .item {
        display: flex;
        align-items: center;
        gap: 0.3rem;

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
      }
    }
  }
`;

const BarChart = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 200px;
  gap: 1rem;
  padding: 0 1rem;
`;

const Bar = styled.div`
  flex: 1;
  background: ${props => props.color || 'var(--secondary-color)'};
  border-radius: 8px 8px 0 0;
  height: ${props => props.height}%;
  position: relative;
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    filter: brightness(1.1);
  }

  .label {
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.8rem;
    color: #6b7280;
    white-space: nowrap;
  }

  .value {
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-weight: 600;
    color: var(--primary-color);
  }
`;

const PieChart = styled.div`
  width: 200px;
  height: 200px;
  margin: 0 auto;
  position: relative;
`;

const AccessTable = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  margin-bottom: 2rem;

  h3 {
    color: var(--primary-color);
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    svg {
      color: var(--secondary-color);
    }
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background: #f9fafb;

    th {
      padding: 0.75rem;
      text-align: left;
      color: #6b7280;
      font-weight: 600;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #e5e7eb;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid #f3f4f6;
      transition: all 0.2s;

      &:hover {
        background: #f9fafb;
      }
    }

    td {
      padding: 1rem 0.75rem;
      color: #374151;
      font-size: 0.95rem;
    }
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .avatar {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .details {
    .name {
      font-weight: 600;
      color: var(--primary-color);
    }

    .email {
      font-size: 0.85rem;
      color: #6b7280;
    }
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  background: ${props => {
    switch(props.status) {
      case 'online': return '#d4f4dd';
      case 'idle': return '#fef3c7';
      case 'offline': return '#f3f4f6';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'online': return '#22c55e';
      case 'idle': return '#f59e0b';
      case 'offline': return '#6b7280';
      default: return '#6b7280';
    }
  }};
`;

const TimeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.9rem;

  svg {
    font-size: 0.9rem;
  }
`;

const SolutionsList = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const SolutionBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => {
    switch(props.solution) {
      case 'SALF': return 'rgba(12, 44, 104, 0.1)';
      case 'SAG': return 'rgba(0, 169, 232, 0.1)';
      case 'PC': return 'rgba(40, 167, 69, 0.1)';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch(props.solution) {
      case 'SALF': return '#0c2c68';
      case 'SAG': return '#00a9e8';
      case 'PC': return '#28a745';
      default: return '#6b7280';
    }
  }};
`;

const ActivityFeed = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;

  h3 {
    color: var(--primary-color);
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    svg {
      color: var(--secondary-color);
    }
  }
`;

const ActivityItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }

  .icon {
    width: 40px;
    height: 40px;
    background: ${props => props.iconBg || '#f3f4f6'};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    svg {
      color: ${props => props.iconColor || '#6b7280'};
      font-size: 1.1rem;
    }
  }

  .content {
    flex: 1;

    .description {
      color: #374151;
      font-size: 0.95rem;
      margin-bottom: 0.3rem;

      strong {
        color: var(--primary-color);
        font-weight: 600;
      }
    }

    .time {
      color: #9ca3af;
      font-size: 0.85rem;
    }
  }
`;

// ========== Main Component ==========
const Dashboard = () => {
  const [dateFilter, setDateFilter] = useState('hoje');
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    activeToday: 0,
    averageTime: '0min',
    totalAccess: 0
  });
  const [chartData, setChartData] = useState({
    weekly: [],
    solutions: []
  });
  const [accessData, setAccessData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar estatísticas da API
  const fetchStats = async () => {
    try {
      const period = dateFilter === 'hoje' ? 'today' : 
                    dateFilter === 'semana' ? 'week' : 
                    dateFilter === 'mes' ? 'month' : 'year';
      
      const response = await api.get(`/dashboard/stats?period=${period}`);
      setStatsData(response.data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  // Função para buscar dados dos gráficos
  const fetchChartData = async () => {
    try {
      const response = await api.get('/dashboard/charts');
      setChartData(response.data);
      console.log('✅ Dados dos gráficos carregados do banco:', response.data);
    } catch (error) {
      console.error('❌ Erro ao buscar dados dos gráficos:', error);
      // Em caso de erro, deixar vazio para mostrar que não há dados
      setChartData({
        weekly: [],
        solutions: []
      });
    }
  };

  // Função para buscar usuários online
  const fetchOnlineUsers = async () => {
    try {
      const response = await api.get('/dashboard/online-users');
      setAccessData(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários online:', error);
      setAccessData([]);
    }
  };

  // Função para buscar atividades recentes
  const fetchRecentActivities = async () => {
    try {
      const response = await api.get('/dashboard/recent-activities');
      setRecentActivities(response.data);
    } catch (error) {
      console.error('Erro ao buscar atividades recentes:', error);
      setRecentActivities([]);
    }
  };

  // useEffect para carregar dados quando o componente monta ou o filtro muda
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchStats(),
        fetchChartData(),
        fetchOnlineUsers(),
        fetchRecentActivities()
      ]);
      setLoading(false);
    };

    loadData();
  }, [dateFilter]);

  // Função para mapear ícones das atividades
  const getActivityIcon = (type) => {
    switch (type) {
      case 'login': return FaUserCheck;
      case 'logout': return FaUserClock;
      case 'access_solution': return FaBook;
      default: return FaUserCheck;
    }
  };

  return (
    <Container>
      <PageHeader>
        <h1>Dashboard de Acessos</h1>
        <p>Acompanhe em tempo real o uso da plataforma</p>
      </PageHeader>

      <DateFilter>
        <FilterButton 
          active={dateFilter === 'hoje'} 
          onClick={() => setDateFilter('hoje')}
        >
          Hoje
        </FilterButton>
        <FilterButton 
          active={dateFilter === 'semana'} 
          onClick={() => setDateFilter('semana')}
        >
          Esta Semana
        </FilterButton>
        <FilterButton 
          active={dateFilter === 'mes'} 
          onClick={() => setDateFilter('mes')}
        >
          Este Mês
        </FilterButton>
        <FilterButton 
          active={dateFilter === 'ano'} 
          onClick={() => setDateFilter('ano')}
        >
          Este Ano
        </FilterButton>
      </DateFilter>

      <StatsGrid>
        <StatCard iconBg="linear-gradient(135deg, #0c2c68, #00a9e8)" trend="up">
          <div className="header">
            <div className="icon">
              <FaUsers />
            </div>
            <div className="trend">
              <FaArrowUp />
              12%
            </div>
          </div>
          <h3>{statsData.totalUsers}</h3>
          <p>Total de Usuários</p>
          <div className="subtitle">+15 novos esta semana</div>
        </StatCard>

        <StatCard iconBg="linear-gradient(135deg, #22c55e, #16a34a)" trend="up">
          <div className="header">
            <div className="icon">
              <FaUserCheck />
            </div>
            <div className="trend">
              <FaArrowUp />
              8%
            </div>
          </div>
          <h3>{statsData.activeToday}</h3>
          <p>Usuários Ativos Hoje</p>
          <div className="subtitle">35% do total</div>
        </StatCard>

        <StatCard iconBg="linear-gradient(135deg, #f59e0b, #d97706)">
          <div className="header">
            <div className="icon">
              <FaClock />
            </div>
          </div>
          <h3>{statsData.averageTime}</h3>
          <p>Tempo Médio Online</p>
          <div className="subtitle">Por sessão hoje</div>
        </StatCard>

        <StatCard iconBg="linear-gradient(135deg, #8b5cf6, #7c3aed)" trend="up">
          <div className="header">
            <div className="icon">
              <FaEye />
            </div>
            <div className="trend">
              <FaArrowUp />
              25%
            </div>
          </div>
          <h3>{statsData.totalAccess}</h3>
          <p>Acessos Hoje</p>
          <div className="subtitle">Todas as soluções</div>
        </StatCard>
      </StatsGrid>

      <ChartsContainer>
        <ChartCard>
          <div className="header">
            <h3>
              <FaChartBar />
              Acessos por Dia da Semana
            </h3>
          </div>
          <BarChart>
            {chartData.weekly && chartData.weekly.length > 0 ? chartData.weekly.map((item, index) => (
              <Bar 
                key={index} 
                height={item.value}
                color={`linear-gradient(135deg, var(--primary-color), var(--secondary-color))`}
              >
                <span className="value">{item.value}</span>
                <span className="label">{item.day}</span>
              </Bar>
            )) : (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '200px',
                color: '#6b7280',
                flexDirection: 'column'
              }}>
                <FaChartBar style={{ fontSize: '2rem', marginBottom: '0.5rem' }} />
                <p>Dados insuficientes para gerar gráfico</p>
                <small>Use o sistema para gerar dados de acesso</small>
              </div>
            )}
          </BarChart>
        </ChartCard>

        <ChartCard>
          <div className="header">
            <h3>
              <FaChartPie />
              Uso por Solução
            </h3>
            <div className="legend">
              {chartData.solutions.map((item, index) => (
                <div key={index} className="item">
                  <div className="dot" style={{ background: item.color }}></div>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '1rem',
            marginTop: '2rem'
          }}>
            {chartData.solutions && chartData.solutions.length > 0 ? chartData.solutions.map((item, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  background: `conic-gradient(${item.color} 0deg ${item.users * 3.6}deg, #f3f4f6 ${item.users * 3.6}deg)`,
                  borderRadius: '50%',
                  margin: '0 auto 0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '70px',
                    height: '70px',
                    background: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '1.2rem',
                    color: item.color
                  }}>
                    {item.users}
                  </div>
                </div>
                <p style={{ 
                  color: item.color, 
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}>
                  {item.name}
                </p>
              </div>
            )) : (
              <div style={{ 
                gridColumn: '1 / -1',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '200px',
                color: '#6b7280',
                flexDirection: 'column'
              }}>
                <FaChartPie style={{ fontSize: '2rem', marginBottom: '0.5rem' }} />
                <p>Dados insuficientes para gerar gráfico</p>
                <small>Use o sistema para gerar dados de uso das soluções</small>
              </div>
            )}
          </div>
        </ChartCard>
      </ChartsContainer>

      <AccessTable>
        <h3>
          <FaUsers />
          Usuários Online Agora
        </h3>
        <Table>
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Status</th>
              <th>Último Acesso</th>
              <th>Tempo Online</th>
              <th>Soluções Acessadas</th>
            </tr>
          </thead>
          <tbody>
            {accessData.length > 0 ? accessData.map(item => (
              <tr key={item.id}>
                <td>
                  <UserInfo>
                    <div className="avatar">
                      {item.user ? item.user.split(' ').map(n => n[0]).join('') : 'U'}
                    </div>
                    <div className="details">
                      <div className="name">{item.user || 'Usuário'}</div>
                      <div className="email">{item.email || ''}</div>
                    </div>
                  </UserInfo>
                </td>
                <td>
                  <StatusBadge status={item.status}>
                    {item.status === 'online' ? 'Online' : 
                     item.status === 'idle' ? 'Ausente' : 'Offline'}
                  </StatusBadge>
                </td>
                <td>
                  <TimeInfo>
                    <FaClock />
                    {item.lastaccess || item.lastAccess || 'N/A'}
                  </TimeInfo>
                </td>
                <td>{item.timeonline || item.timeOnline || '0 min'}</td>
                <td>
                  <SolutionsList>
                    {(item.solutions || []).map((solution, index) => (
                      <SolutionBadge key={index} solution={solution}>
                        {solution}
                      </SolutionBadge>
                    ))}
                  </SolutionsList>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  {loading ? 'Carregando usuários online...' : 'Nenhum usuário online no momento'}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </AccessTable>

      <ActivityFeed>
        <h3>
          <FaCalendarAlt />
          Atividades Recentes
        </h3>
        {recentActivities.length > 0 ? recentActivities.map(activity => {
          const IconComponent = getActivityIcon(activity.type);
          return (
          <ActivityItem 
            key={activity.id}
            iconBg={activity.iconBg}
            iconColor={activity.iconColor}
          >
            <div className="icon">
                <IconComponent />
            </div>
            <div className="content">
              <div 
                className="description" 
                dangerouslySetInnerHTML={{ __html: activity.description }}
              />
              <div className="time">{activity.time}</div>
            </div>
          </ActivityItem>
          );
        }) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            {loading ? 'Carregando atividades...' : 'Nenhuma atividade recente'}
          </div>
        )}
      </ActivityFeed>
    </Container>
  );
};

export default Dashboard;

