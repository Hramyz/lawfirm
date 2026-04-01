require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use('/api/clients', require('./routes/clients'));
app.use('/api/cases', require('./routes/cases'));
app.use('/api/users', require('./routes/users'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/invoices', require('./routes/invoices'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/time-entries', require('./routes/timeEntries'));
app.use('/api/court-hearings', require('./routes/courtHearings'));
app.use('/api/opposing-counsel', require('./routes/opposingCounsel'));
app.use('/api/case-notes', require('./routes/caseNotes'));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
