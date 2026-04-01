const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clients ORDER BY client_id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clients WHERE client_id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { first_name, last_name, email, phone, address, date_of_birth, notes } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO clients (first_name, last_name, email, phone, address, date_of_birth, notes) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [first_name, last_name, email, phone, address, date_of_birth, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { first_name, last_name, email, phone, address, date_of_birth, notes } = req.body;
  try {
    const result = await pool.query(
      'UPDATE clients SET first_name=$1, last_name=$2, email=$3, phone=$4, address=$5, date_of_birth=$6, notes=$7 WHERE client_id=$8 RETURNING *',
      [first_name, last_name, email, phone, address, date_of_birth, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM clients WHERE client_id=$1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
