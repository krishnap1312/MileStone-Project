const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/employees', (req, res) => {
  const {
    employeeId,
    fullName,
    dob,
    address,
    contactNumber,
    dateOfJoining,
    bankName,
    accountNumber
  } = req.body;

  const sql = `
    INSERT INTO employees (employeeId, fullName, dob, address, contactNumber, dateOfJoining, bankName, accountNumber)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [employeeId, fullName, dob, address, contactNumber, dateOfJoining, bankName, accountNumber], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ message: 'Employee added successfully' });
  });
});

router.get('/employees', (req, res) => {
  db.query('SELECT * FROM employees', (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
});

module.exports = router;
