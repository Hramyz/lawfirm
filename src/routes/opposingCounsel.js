const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM opposing_counsel ORDER BY counsel_id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM opposing_counsel WHERE counsel_id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { case_id, first_name, last_name, firm_name, email, phone, notes } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO opposing_counsel (case_id, first_name, last_name, firm_name, email, phone, notes) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [case_id, first_name, last_name, firm_name, email, phone, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { case_id, first_name, last_name, firm_name, email, phone, notes } = req.body;
  try {
    const result = await pool.query(
      'UPDATE opposing_counsel SET case_id=$1, first_name=$2, last_name=$3, firm_name=$4, email=$5, phone=$6, notes=$7 WHERE counsel_id=$8 RETURNING *',
      [case_id, first_name, last_name, firm_name, email, phone, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM opposing_counsel WHERE counsel_id=$1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
