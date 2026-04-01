const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM case_notes ORDER BY note_id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM case_notes WHERE note_id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { case_id, user_id, note_text, is_private } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO case_notes (case_id, user_id, note_text, is_private) VALUES ($1,$2,$3,$4) RETURNING *',
      [case_id, user_id, note_text, is_private]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { case_id, user_id, note_text, is_private } = req.body;
  try {
    const result = await pool.query(
      'UPDATE case_notes SET case_id=$1, user_id=$2, note_text=$3, is_private=$4, updated_at=CURRENT_TIMESTAMP WHERE note_id=$5 RETURNING *',
      [case_id, user_id, note_text, is_private, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM case_notes WHERE note_id=$1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
