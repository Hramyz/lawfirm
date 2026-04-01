const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM documents ORDER BY document_id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM documents WHERE document_id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { case_id, uploaded_by, filename, file_path, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO documents (case_id, uploaded_by, filename, file_path, description) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [case_id, uploaded_by, filename, file_path, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { case_id, uploaded_by, filename, file_path, description } = req.body;
  try {
    const result = await pool.query(
      'UPDATE documents SET case_id=$1, uploaded_by=$2, filename=$3, file_path=$4, description=$5 WHERE document_id=$6 RETURNING *',
      [case_id, uploaded_by, filename, file_path, description, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM documents WHERE document_id=$1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
