const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

// Listar todos os municípios
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { search } = req.query;
    
    let query = `
      SELECT m.*,
        COUNT(DISTINCT u.id) as users_count,
        COUNT(DISTINCT CASE WHEN u.role != 'admin' THEN u.id END) as regular_users_count
      FROM municipalities m
      LEFT JOIN users u ON m.id = u.municipality_id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (m.name ILIKE $${params.length} OR m.state ILIKE $${params.length})`;
    }
    
    query += ' GROUP BY m.id ORDER BY m.name';
    
    const result = await pool.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar municípios:', error);
    res.status(500).json({ message: 'Erro ao listar municípios' });
  }
});

// Buscar município por ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT m.*,
        COUNT(DISTINCT u.id) as users_count,
        COUNT(DISTINCT CASE WHEN u.role != 'admin' THEN u.id END) as regular_users_count
      FROM municipalities m
      LEFT JOIN users u ON m.id = u.municipality_id
      WHERE m.id = $1
      GROUP BY m.id`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Município não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar município:', error);
    res.status(500).json({ message: 'Erro ao buscar município' });
  }
});

// Criar novo município (admin)
router.post('/', authMiddleware, adminMiddleware, [
  body('name').notEmpty().trim(),
  body('state').isLength({ min: 2, max: 2 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, state } = req.body;
    
    // Verificar se já existe
    const existingCheck = await pool.query(
      'SELECT id FROM municipalities WHERE LOWER(name) = LOWER($1) AND state = $2',
      [name, state]
    );
    
    if (existingCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Este município já está cadastrado' });
    }
    
    const result = await pool.query(
      'INSERT INTO municipalities (name, state) VALUES ($1, $2) RETURNING *',
      [name, state.toUpperCase()]
    );
    
    res.status(201).json({
      message: 'Município criado com sucesso',
      municipality: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao criar município:', error);
    res.status(500).json({ message: 'Erro ao criar município' });
  }
});

// Atualizar município (admin)
router.put('/:id', authMiddleware, adminMiddleware, [
  body('name').optional().notEmpty().trim(),
  body('state').optional().isLength({ min: 2, max: 2 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const { name, state } = req.body;
    
    // Verificar se existe
    const existingCheck = await pool.query('SELECT id FROM municipalities WHERE id = $1', [id]);
    if (existingCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Município não encontrado' });
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
    
    if (state) {
      updates.push(`state = $${paramCount}`);
      values.push(state.toUpperCase());
      paramCount++;
    }
    
    values.push(id);
    
    const result = await pool.query(
      `UPDATE municipalities SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    
    res.json({
      message: 'Município atualizado com sucesso',
      municipality: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar município:', error);
    res.status(500).json({ message: 'Erro ao atualizar município' });
  }
});

// Deletar município (admin)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se há usuários vinculados
    const usersCheck = await pool.query(
      'SELECT COUNT(*) as count FROM users WHERE municipality_id = $1',
      [id]
    );
    
    if (parseInt(usersCheck.rows[0].count) > 0) {
      return res.status(400).json({ 
        message: 'Não é possível excluir este município pois há usuários vinculados a ele' 
      });
    }
    
    const result = await pool.query(
      'DELETE FROM municipalities WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Município não encontrado' });
    }
    
    res.json({ message: 'Município deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar município:', error);
    res.status(500).json({ message: 'Erro ao deletar município' });
  }
});

module.exports = router;
