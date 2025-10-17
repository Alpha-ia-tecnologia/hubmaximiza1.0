const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

// Obter estatísticas do dashboard (admin)
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { period = 'today' } = req.query;
    
    // Configurar período de tempo
    let dateFilter = '';
    switch (period) {
      case 'today':
        dateFilter = "DATE(created_at) = CURRENT_DATE";
        break;
      case 'week':
        dateFilter = "created_at >= CURRENT_DATE - INTERVAL '7 days'";
        break;
      case 'month':
        dateFilter = "created_at >= CURRENT_DATE - INTERVAL '30 days'";
        break;
      case 'year':
        dateFilter = "created_at >= CURRENT_DATE - INTERVAL '1 year'";
        break;
      default:
        dateFilter = "1=1";
    }
    
    // Total de usuários
    const totalUsersResult = await pool.query(
      'SELECT COUNT(*) as count FROM users WHERE role != $1',
      ['admin']
    );
    
    // Usuários ativos hoje
    const activeUsersResult = await pool.query(
      `SELECT COUNT(DISTINCT user_id) as count 
       FROM access_logs 
       WHERE DATE(created_at) = CURRENT_DATE`
    );
    
    // Total de acessos no período
    const totalAccessResult = await pool.query(
      `SELECT COUNT(*) as count 
       FROM access_logs 
       WHERE ${dateFilter}`
    );
    
    // Tempo médio online (em minutos)
    const avgTimeResult = await pool.query(
      `SELECT 
        COALESCE(AVG(
          EXTRACT(EPOCH FROM (last_activity - started_at)) / 60
        ), 0) as avg_minutes
       FROM active_sessions 
       WHERE DATE(started_at) = CURRENT_DATE`
    );
    
    // Formatar tempo médio
    const avgMinutes = Math.round(avgTimeResult.rows[0].avg_minutes || 0);
    const hours = Math.floor(avgMinutes / 60);
    const minutes = avgMinutes % 60;
    const averageTime = hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
    
    res.json({
      totalUsers: parseInt(totalUsersResult.rows[0].count),
      activeToday: parseInt(activeUsersResult.rows[0].count),
      totalAccess: parseInt(totalAccessResult.rows[0].count),
      averageTime
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas' });
  }
});

// Obter dados para gráficos (admin)
router.get('/charts', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // Acessos por dia da semana (últimos 7 dias)
    const weeklyAccessResult = await pool.query(`
      SELECT 
        TO_CHAR(created_at, 'Day') as day_name,
        TO_CHAR(created_at, 'D') as day_number,
        COUNT(*) as count
      FROM access_logs
      WHERE created_at >= CURRENT_DATE - INTERVAL '6 days'
      GROUP BY TO_CHAR(created_at, 'Day'), TO_CHAR(created_at, 'D')
      ORDER BY TO_CHAR(created_at, 'D')
    `);
    
    // Mapeamento dos dias da semana
    const dayNames = {
      '1': 'Dom',
      '2': 'Seg',
      '3': 'Ter',
      '4': 'Qua',
      '5': 'Qui',
      '6': 'Sex',
      '7': 'Sáb'
    };
    
    const weeklyData = weeklyAccessResult.rows.map(row => ({
      day: dayNames[row.day_number],
      value: parseInt(row.count)
    }));
    
    // Uso por solução
    const solutionUsageResult = await pool.query(`
      SELECT 
        s.name,
        s.color,
        COUNT(DISTINCT us.user_id) as users
      FROM solutions s
      LEFT JOIN user_solutions us ON s.id = us.solution_id
      WHERE s.active = true
      GROUP BY s.id, s.name, s.color
      ORDER BY users DESC
    `);
    
    res.json({
      weekly: weeklyData,
      solutions: solutionUsageResult.rows.map(row => ({
        name: row.name,
        users: parseInt(row.users),
        color: row.color
      }))
    });
  } catch (error) {
    console.error('Erro ao buscar dados dos gráficos:', error);
    res.status(500).json({ message: 'Erro ao buscar dados dos gráficos' });
  }
});

// Obter usuários online (admin)
router.get('/online-users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.name as user,
        u.email,
        m.name as municipality,
        CASE 
          WHEN al.last_access < NOW() - INTERVAL '5 minutes' THEN 'offline'
          WHEN al.last_access < NOW() - INTERVAL '1 minute' THEN 'idle'
          ELSE 'online'
        END as status,
        CASE 
          WHEN al.last_access IS NULL THEN 'Nunca'
          WHEN al.last_access > NOW() - INTERVAL '1 minute' THEN 'Agora'
          WHEN al.last_access > NOW() - INTERVAL '1 hour' THEN 
            CONCAT(EXTRACT(MINUTE FROM NOW() - al.last_access), ' min atrás')
          WHEN al.last_access > NOW() - INTERVAL '1 day' THEN 
            CONCAT(EXTRACT(HOUR FROM NOW() - al.last_access), ' horas atrás')
          ELSE CONCAT(EXTRACT(DAY FROM NOW() - al.last_access), ' dias atrás')
        END as lastAccess,
        COALESCE(
          CONCAT(
            FLOOR(EXTRACT(EPOCH FROM (NOW() - ss.started_at)) / 3600), 'h ',
            FLOOR((EXTRACT(EPOCH FROM (NOW() - ss.started_at)) % 3600) / 60), 'min'
          ),
          '0 min'
        ) as timeOnline,
        array_agg(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL) as solutions
      FROM users u
      LEFT JOIN municipalities m ON u.municipality_id = m.id
      LEFT JOIN (
        SELECT user_id, MAX(created_at) as last_access
        FROM access_logs
        WHERE created_at > NOW() - INTERVAL '24 hours'
        GROUP BY user_id
      ) al ON u.id = al.user_id
      LEFT JOIN (
        SELECT user_id, MIN(started_at) as started_at
        FROM active_sessions
        WHERE DATE(started_at) = CURRENT_DATE
        GROUP BY user_id
      ) ss ON u.id = ss.user_id
      LEFT JOIN user_solutions us ON u.id = us.user_id
      LEFT JOIN solutions s ON us.solution_id = s.id AND s.active = true
      WHERE u.role != 'admin'
        AND al.last_access IS NOT NULL
      GROUP BY u.id, u.name, u.email, m.name, al.last_access, ss.started_at
      ORDER BY al.last_access DESC
      LIMIT 20
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar usuários online:', error);
    res.status(500).json({ message: 'Erro ao buscar usuários online' });
  }
});

// Obter atividades recentes (admin)
router.get('/recent-activities', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        al.id,
        al.action as type,
        u.name as user_name,
        s.name as solution_name,
        al.created_at,
        CASE 
          WHEN al.created_at > NOW() - INTERVAL '1 minute' THEN 'Agora mesmo'
          WHEN al.created_at > NOW() - INTERVAL '1 hour' THEN 
            CONCAT(EXTRACT(MINUTE FROM NOW() - al.created_at), ' minutos atrás')
          WHEN al.created_at > NOW() - INTERVAL '1 day' THEN 
            CONCAT(EXTRACT(HOUR FROM NOW() - al.created_at), ' horas atrás')
          ELSE CONCAT(EXTRACT(DAY FROM NOW() - al.created_at), ' dias atrás')
        END as time
      FROM access_logs al
      JOIN users u ON al.user_id = u.id
      LEFT JOIN solutions s ON al.solution_id = s.id
      WHERE al.created_at > NOW() - INTERVAL '24 hours'
      ORDER BY al.created_at DESC
      LIMIT 10
    `);
    
    // Formatar as atividades
    const activities = result.rows.map(row => {
      let description = '';
      let icon = 'FaUserCheck';
      let iconBg = '#d4f4dd';
      let iconColor = '#22c55e';
      
      switch (row.type) {
        case 'login':
          description = `<strong>${row.user_name}</strong> fez login no sistema`;
          icon = 'FaUserCheck';
          iconBg = '#d4f4dd';
          iconColor = '#22c55e';
          break;
        case 'logout':
          description = `<strong>${row.user_name}</strong> fez logout do sistema`;
          icon = 'FaUserClock';
          iconBg = '#ffd4d4';
          iconColor = '#ef4444';
          break;
        case 'access_solution':
          description = `<strong>${row.user_name}</strong> acessou ${row.solution_name || 'uma solução'}`;
          icon = 'FaBook';
          iconBg = 'rgba(0, 169, 232, 0.1)';
          iconColor = '#00a9e8';
          break;
      }
      
      return {
        id: row.id,
        type: row.type,
        description,
        time: row.time,
        icon,
        iconBg,
        iconColor
      };
    });
    
    res.json(activities);
  } catch (error) {
    console.error('Erro ao buscar atividades recentes:', error);
    res.status(500).json({ message: 'Erro ao buscar atividades recentes' });
  }
});

// Dashboard do usuário comum
router.get('/user-dashboard', authMiddleware, async (req, res) => {
  try {
    // Buscar soluções do usuário
    const solutionsResult = await pool.query(
      `SELECT s.* 
       FROM solutions s
       JOIN user_solutions us ON s.id = us.solution_id
       WHERE us.user_id = $1 AND s.active = true
       ORDER BY s.name`,
      [req.userId]
    );
    
    // Buscar últimos acessos
    const recentAccessResult = await pool.query(
      `SELECT 
        s.name as solution_name,
        al.created_at,
        CASE 
          WHEN al.created_at > NOW() - INTERVAL '1 hour' THEN 
            CONCAT(EXTRACT(MINUTE FROM NOW() - al.created_at), ' minutos atrás')
          WHEN al.created_at > NOW() - INTERVAL '1 day' THEN 
            CONCAT(EXTRACT(HOUR FROM NOW() - al.created_at), ' horas atrás')
          ELSE CONCAT(EXTRACT(DAY FROM NOW() - al.created_at), ' dias atrás')
        END as time_ago
       FROM access_logs al
       JOIN solutions s ON al.solution_id = s.id
       WHERE al.user_id = $1 AND al.action = 'access_solution'
       ORDER BY al.created_at DESC
       LIMIT 5`,
      [req.userId]
    );
    
    res.json({
      solutions: solutionsResult.rows,
      recentAccess: recentAccessResult.rows
    });
  } catch (error) {
    console.error('Erro ao buscar dashboard do usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar dados do dashboard' });
  }
});

module.exports = router;
