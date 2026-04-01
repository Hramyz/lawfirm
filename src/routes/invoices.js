const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM invoices ORDER BY invoice_id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM invoices WHERE invoice_id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { case_id, client_id, issued_date, due_date, total_amount, status } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO invoices (case_id, client_id, issued_date, due_date, total_amount, status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [case_id, client_id, issued_date, due_date, total_amount, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { case_id, client_id, issued_date, due_date, total_amount, status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE invoices SET case_id=$1, client_id=$2, issued_date=$3, due_date=$4, total_amount=$5, status=$6 WHERE invoice_id=$7 RETURNING *',
      [case_id, client_id, issued_date, due_date, total_amount, status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM invoices WHERE invoice_id=$1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
