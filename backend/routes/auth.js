const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authMiddleware } = require('../middlewares/auth');

// Função para gerar token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'hub_maximiza_secret_key_2024',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Rota de login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Buscar usuário
    const result = await pool.query(
      `SELECT u.*, m.name as municipality_name 
       FROM users u 
       LEFT JOIN municipalities m ON u.municipality_id = m.id 
       WHERE u.email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    const user = result.rows[0];

    // Verificar se o usuário está ativo
    if (!user.active) {
      return res.status(401).json({ message: 'Sua conta está desativada. Entre em contato com o administrador.' });
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Atualizar último login
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Registrar log de acesso
    await pool.query(
      'INSERT INTO access_logs (user_id, action, ip_address, user_agent) VALUES ($1, $2, $3, $4)',
      [user.id, 'login', req.ip, req.get('user-agent')]
    );

    // Gerar token
    const token = generateToken(user);

    // Buscar soluções do usuário (se não for admin)
    let solutions = [];
    if (user.role !== 'admin') {
      const solutionsResult = await pool.query(
        `SELECT s.* FROM solutions s 
         JOIN user_solutions us ON s.id = us.solution_id 
         WHERE us.user_id = $1 AND s.active = true`,
        [user.id]
      );
      solutions = solutionsResult.rows;
    }

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        municipality: user.municipality_name,
        municipality_id: user.municipality_id,
        solutions
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
});

// Rota de registro (apenas admin pode criar usuários)
router.post('/register', [
  authMiddleware,
  body('name').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['user', 'admin']),
  body('municipality_id').isNumeric()
], async (req, res) => {
  try {
    // Verificar se é admin
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Apenas administradores podem criar usuários' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role, municipality_id } = req.body;

    // Verificar se o email já existe
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Este email já está cadastrado' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, municipality_id) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, name, email, role, municipality_id`,
      [name, email, hashedPassword, role, municipality_id]
    );

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
});

// Rota para verificar token
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.*, m.name as municipality_name 
       FROM users u 
       LEFT JOIN municipalities m ON u.municipality_id = m.id 
       WHERE u.id = $1`,
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const user = result.rows[0];

    // Buscar soluções do usuário (se não for admin)
    let solutions = [];
    if (user.role !== 'admin') {
      const solutionsResult = await pool.query(
        `SELECT s.* FROM solutions s 
         JOIN user_solutions us ON s.id = us.solution_id 
         WHERE us.user_id = $1 AND s.active = true`,
        [user.id]
      );
      solutions = solutionsResult.rows;
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        municipality: user.municipality_name,
        municipality_id: user.municipality_id,
        solutions
      }
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar dados do usuário' });
  }
});

// Rota de logout
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    // Registrar log de logout
    await pool.query(
      'INSERT INTO access_logs (user_id, action, ip_address, user_agent) VALUES ($1, $2, $3, $4)',
      [req.userId, 'logout', req.ip, req.get('user-agent')]
    );

    res.json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({ message: 'Erro ao fazer logout' });
  }
});

module.exports = router;
