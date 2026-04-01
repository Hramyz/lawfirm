const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT user_id, first_name, last_name, email, phone, role, created_at FROM users ORDER BY user_id'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT user_id, first_name, last_name, email, phone, role, created_at FROM users WHERE user_id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { first_name, last_name, email, phone, role, password_hash } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (first_name, last_name, email, phone, role, password_hash) VALUES ($1,$2,$3,$4,$5,$6) RETURNING user_id, first_name, last_name, email, phone, role, created_at',
      [first_name, last_name, email, phone, role, password_hash]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { first_name, last_name, email, phone, role, password_hash } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET first_name=$1, last_name=$2, email=$3, phone=$4, role=$5, password_hash=$6 WHERE user_id=$7 RETURNING user_id, first_name, last_name, email, phone, role, created_at',
      [first_name, last_name, email, phone, role, password_hash, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM users WHERE user_id=$1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
