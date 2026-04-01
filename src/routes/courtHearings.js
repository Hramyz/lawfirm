const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM court_hearings ORDER BY hearing_id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM court_hearings WHERE hearing_id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { case_id, hearing_date, court_name, court_room, judge_name, hearing_type, outcome, notes } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO court_hearings (case_id, hearing_date, court_name, court_room, judge_name, hearing_type, outcome, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
      [case_id, hearing_date, court_name, court_room, judge_name, hearing_type, outcome, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { case_id, hearing_date, court_name, court_room, judge_name, hearing_type, outcome, notes } = req.body;
  try {
    const result = await pool.query(
      'UPDATE court_hearings SET case_id=$1, hearing_date=$2, court_name=$3, court_room=$4, judge_name=$5, hearing_type=$6, outcome=$7, notes=$8 WHERE hearing_id=$9 RETURNING *',
      [case_id, hearing_date, court_name, court_room, judge_name, hearing_type, outcome, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM court_hearings WHERE hearing_id=$1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
