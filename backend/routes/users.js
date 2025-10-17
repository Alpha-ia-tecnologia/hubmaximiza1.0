const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

// Listar todos os usuários (admin)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { municipality_id, search } = req.query;
    
    let query = `
      SELECT u.*, m.name as municipality_name,
        COUNT(DISTINCT us.solution_id) as solutions_count,
        array_agg(DISTINCT s.id) FILTER (WHERE s.id IS NOT NULL) as solution_ids
      FROM users u 
      LEFT JOIN municipalities m ON u.municipality_id = m.id
      LEFT JOIN user_solutions us ON u.id = us.user_id
      LEFT JOIN solutions s ON us.solution_id = s.id AND s.active = true
      WHERE 1=1
    `;
    
    const params = [];
    
    if (municipality_id) {
      params.push(municipality_id);
      query += ` AND u.municipality_id = $${params.length}`;
    }
    
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (u.name ILIKE $${params.length} OR u.email ILIKE $${params.length})`;
    }
    
    query += ' GROUP BY u.id, m.name ORDER BY u.created_at DESC';
    
    const result = await pool.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ message: 'Erro ao listar usuários' });
  }
});

// Buscar usuário por ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar permissão (admin ou próprio usuário)
    if (req.userRole !== 'admin' && req.userId !== parseInt(id)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    
    const result = await pool.query(
      `SELECT u.*, m.name as municipality_name 
       FROM users u 
       LEFT JOIN municipalities m ON u.municipality_id = m.id 
       WHERE u.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    const user = result.rows[0];
    
    // Buscar soluções do usuário
    const solutionsResult = await pool.query(
      `SELECT s.* FROM solutions s 
       JOIN user_solutions us ON s.id = us.solution_id 
       WHERE us.user_id = $1`,
      [id]
    );
    
    user.solutions = solutionsResult.rows;
    
    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar usuário' });
  }
});

// Atualizar usuário
router.put('/:id', authMiddleware, adminMiddleware, [
  body('name').optional().notEmpty().trim(),
  body('email').optional().isEmail().normalizeEmail(),
  body('password').optional().isLength({ min: 6 }),
  body('role').optional().isIn(['user', 'admin']),
  body('municipality_id').optional().isNumeric(),
  body('active').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const { name, email, password, role, municipality_id, active } = req.body;
    
    // Verificar se o usuário existe
    const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    // Verificar se o email já está em uso
    if (email) {
      const emailCheck = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, id]
      );
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ message: 'Este email já está em uso' });
      }
    }
    
    // Construir query de atualização
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    if (name) {
      updates.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }
    
    if (email) {
      updates.push(`email = $${paramCount}`);
      values.push(email);
      paramCount++;
    }
    
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push(`password = $${paramCount}`);
      values.push(hashedPassword);
      paramCount++;
    }
    
    if (role) {
      updates.push(`role = $${paramCount}`);
      values.push(role);
      paramCount++;
    }
    
    if (municipality_id) {
      updates.push(`municipality_id = $${paramCount}`);
      values.push(municipality_id);
      paramCount++;
    }
    
    if (active !== undefined) {
      updates.push(`active = $${paramCount}`);
      values.push(active);
      paramCount++;
    }
    
    values.push(id);
    
    const result = await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    
    res.json({
      message: 'Usuário atualizado com sucesso',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
});

// Atualizar soluções do usuário
router.put('/:id/solutions', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { solutionIds } = req.body;
    
    if (!Array.isArray(solutionIds)) {
      return res.status(400).json({ message: 'solutionIds deve ser um array' });
    }
    
    // Verificar se o usuário existe
    const userCheck = await pool.query('SELECT id, role FROM users WHERE id = $1', [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    // Admin tem acesso a todas as soluções
    if (userCheck.rows[0].role === 'admin') {
      return res.status(400).json({ message: 'Administradores têm acesso a todas as soluções' });
    }
    
    // Iniciar transação
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Remover todas as soluções atuais
      await client.query('DELETE FROM user_solutions WHERE user_id = $1', [id]);
      
      // Adicionar novas soluções
      for (const solutionId of solutionIds) {
        await client.query(
          'INSERT INTO user_solutions (user_id, solution_id) VALUES ($1, $2)',
          [id, solutionId]
        );
      }
      
      await client.query('COMMIT');
      
      res.json({ message: 'Soluções atualizadas com sucesso' });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Erro ao atualizar soluções:', error);
    res.status(500).json({ message: 'Erro ao atualizar soluções' });
  }
});

// Deletar usuário
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Não permitir deletar o próprio usuário
    if (req.userId === parseInt(id)) {
      return res.status(400).json({ message: 'Você não pode deletar sua própria conta' });
    }
    
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ message: 'Erro ao deletar usuário' });
  }
});

module.exports = router;
