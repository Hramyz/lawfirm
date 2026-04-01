const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cases ORDER BY case_id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cases WHERE case_id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { case_number, title, client_id, case_type, status, date_opened, date_closed, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO cases (case_number, title, client_id, case_type, status, date_opened, date_closed, description) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
      [case_number, title, client_id, case_type, status, date_opened, date_closed, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { case_number, title, client_id, case_type, status, date_opened, date_closed, description } = req.body;
  try {
    const result = await pool.query(
      'UPDATE cases SET case_number=$1, title=$2, client_id=$3, case_type=$4, status=$5, date_opened=$6, date_closed=$7, description=$8 WHERE case_id=$9 RETURNING *',
      [case_number, title, client_id, case_type, status, date_opened, date_closed, description, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM cases WHERE case_id=$1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
