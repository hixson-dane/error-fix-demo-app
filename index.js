const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Healthy route
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Route that causes a runtime error (TypeError) so a stack trace can be gathered
app.get('/users/:id', (req, res, next) => {
  try {
    const users = undefined;
    // This line will throw: TypeError: Cannot read properties of undefined (reading 'find')
    const user = users.find((u) => u.id === parseInt(req.params.id));
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Global error handler — captures the stack trace and returns it in the response
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: err.message,
    stack: err.stack,
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

module.exports = app;
