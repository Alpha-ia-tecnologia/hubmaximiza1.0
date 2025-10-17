const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

// Listar todas as soluções
router.get('/', authMiddleware, async (req, res) => {
  try {
    let query;
    let params = [];
    
    if (req.userRole === 'admin') {
      // Admin vê todas as soluções
      query = `
        SELECT s.*,
          COUNT(DISTINCT us.user_id) as users_count
        FROM solutions s
        LEFT JOIN user_solutions us ON s.id = us.solution_id
        GROUP BY s.id
        ORDER BY s.name
      `;
    } else {
      // Usuário comum vê apenas suas soluções
      query = `
        SELECT s.*,
          COUNT(DISTINCT us2.user_id) as users_count
        FROM solutions s
        JOIN user_solutions us ON s.id = us.solution_id
        LEFT JOIN user_solutions us2 ON s.id = us2.solution_id
        WHERE us.user_id = $1 AND s.active = true
        GROUP BY s.id
        ORDER BY s.name
      `;
      params = [req.userId];
    }
    
    const result = await pool.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar soluções:', error);
    res.status(500).json({ message: 'Erro ao listar soluções' });
  }
});

// Buscar solução por ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se o usuário tem acesso à solução
    if (req.userRole !== 'admin') {
      const accessCheck = await pool.query(
        'SELECT id FROM user_solutions WHERE user_id = $1 AND solution_id = $2',
        [req.userId, id]
      );
      
      if (accessCheck.rows.length === 0) {
        return res.status(403).json({ message: 'Acesso negado a esta solução' });
      }
    }
    
    const result = await pool.query(
      `SELECT s.*,
        COUNT(DISTINCT us.user_id) as users_count
      FROM solutions s
      LEFT JOIN user_solutions us ON s.id = us.solution_id
      WHERE s.id = $1
      GROUP BY s.id`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Solução não encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar solução:', error);
    res.status(500).json({ message: 'Erro ao buscar solução' });
  }
});

// Criar nova solução (admin)
router.post('/', authMiddleware, adminMiddleware, [
  body('name').notEmpty().trim(),
  body('description').optional().trim(),
  body('icon').optional().trim(),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, description, icon, color } = req.body;
    
    // Verificar se já existe
    const existingCheck = await pool.query(
      'SELECT id FROM solutions WHERE LOWER(name) = LOWER($1)',
      [name]
    );
    
    if (existingCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Esta solução já está cadastrada' });
    }
    
    const result = await pool.query(
      'INSERT INTO solutions (name, description, icon, color) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, icon, color]
    );
    
    res.status(201).json({
      message: 'Solução criada com sucesso',
      solution: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao criar solução:', error);
    res.status(500).json({ message: 'Erro ao criar solução' });
  }
});

// Atualizar solução (admin)
router.put('/:id', authMiddleware, adminMiddleware, [
  body('name').optional().notEmpty().trim(),
  body('description').optional().trim(),
  body('icon').optional().trim(),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i),
  body('active').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const { name, description, icon, color, active } = req.body;
    
    // Verificar se existe
    const existingCheck = await pool.query('SELECT id FROM solutions WHERE id = $1', [id]);
    if (existingCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Solução não encontrada' });
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
    
    if (description !== undefined) {
      updates.push(`description = $${paramCount}`);
      values.push(description);
      paramCount++;
    }
    
    if (icon !== undefined) {
      updates.push(`icon = $${paramCount}`);
      values.push(icon);
      paramCount++;
    }
    
    if (color) {
      updates.push(`color = $${paramCount}`);
      values.push(color);
      paramCount++;
    }
    
    if (active !== undefined) {
      updates.push(`active = $${paramCount}`);
      values.push(active);
      paramCount++;
    }
    
    values.push(id);
    
    const result = await pool.query(
      `UPDATE solutions SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    
    res.json({
      message: 'Solução atualizada com sucesso',
      solution: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar solução:', error);
    res.status(500).json({ message: 'Erro ao atualizar solução' });
  }
});

// Deletar solução (admin)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se há usuários usando a solução
    const usersCheck = await pool.query(
      'SELECT COUNT(*) as count FROM user_solutions WHERE solution_id = $1',
      [id]
    );
    
    if (parseInt(usersCheck.rows[0].count) > 0) {
      return res.status(400).json({ 
        message: 'Não é possível excluir esta solução pois há usuários vinculados a ela' 
      });
    }
    
    const result = await pool.query(
      'DELETE FROM solutions WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Solução não encontrada' });
    }
    
    res.json({ message: 'Solução deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar solução:', error);
    res.status(500).json({ message: 'Erro ao deletar solução' });
  }
});

// Registrar acesso a uma solução
router.post('/:id/access', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se o usuário tem acesso à solução
    if (req.userRole !== 'admin') {
      const accessCheck = await pool.query(
        'SELECT id FROM user_solutions WHERE user_id = $1 AND solution_id = $2',
        [req.userId, id]
      );
      
      if (accessCheck.rows.length === 0) {
        return res.status(403).json({ message: 'Acesso negado a esta solução' });
      }
    }
    
    // Registrar o acesso
    await pool.query(
      'INSERT INTO access_logs (user_id, solution_id, action, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5)',
      [req.userId, id, 'access_solution', req.ip, req.get('user-agent')]
    );
    
    res.json({ message: 'Acesso registrado com sucesso' });
  } catch (error) {
    console.error('Erro ao registrar acesso:', error);
    res.status(500).json({ message: 'Erro ao registrar acesso' });
  }
});

module.exports = router;
