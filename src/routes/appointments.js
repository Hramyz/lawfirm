const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM appointments ORDER BY appointment_id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM appointments WHERE appointment_id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { case_id, client_id, user_id, datetime_start, datetime_end, location, notes } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO appointments (case_id, client_id, user_id, datetime_start, datetime_end, location, notes) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [case_id, client_id, user_id, datetime_start, datetime_end, location, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { case_id, client_id, user_id, datetime_start, datetime_end, location, notes } = req.body;
  try {
    const result = await pool.query(
      'UPDATE appointments SET case_id=$1, client_id=$2, user_id=$3, datetime_start=$4, datetime_end=$5, location=$6, notes=$7 WHERE appointment_id=$8 RETURNING *',
      [case_id, client_id, user_id, datetime_start, datetime_end, location, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM appointments WHERE appointment_id=$1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
