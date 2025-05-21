const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'Admim',
  password: 'Admin', 
  database: 'employee_db'
});

let employees = [];

db.connect((err) => {
  if (err) {
    console.error('MySQL connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL');

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS employees (
      id INT AUTO_INCREMENT PRIMARY KEY,
      employeeId VARCHAR(50) NOT NULL,
      fullName VARCHAR(100) NOT NULL,
      dob DATE NOT NULL,
      address TEXT NOT NULL,
      contactNumber VARCHAR(15) NOT NULL,
      dateOfJoining DATE NOT NULL,
      bankName VARCHAR(100) NOT NULL,
      accountNumber VARCHAR(30) NOT NULL
    );
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Employees table is ready');

      db.query('SELECT * FROM employees', (err, results) => {
        if (!err) {
          employees = results;
          console.log('In-memory employee cache synced from DB');
        }
      });
    }
  });
});

app.post('/employees', (req, res) => {
  const emp = req.body;

  const sql = `
    INSERT INTO employees 
    (employeeId, fullName, dob, address, contactNumber, dateOfJoining, bankName, accountNumber)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
  `;

  const values = [
    emp.employeeId,
    emp.fullName,
    emp.dob,
    emp.address,
    emp.contactNumber,
    emp.dateOfJoining,
    emp.bankName,
    emp.accountNumber
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting employee:', err);
      res.status(500).json({ error: 'Database insert failed' });
    } else {
      employees.push({ id: result.insertId, ...emp });
      res.status(201).json({ message: 'Employee added successfully' });
    }
  });
});

app.get('/employees', (req, res) => {
  res.json(employees);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


// Local Storage for testing without connecting to backend like SQL or MongoDB. Please comment out below code if you are using SQL


// const express = require('express');
// const cors = require('cors');

// const app = express();
// const PORT = 5000;

// app.use(cors());
// app.use(express.json());

// let employees = [];

// app.post('/employees', (req, res) => {
//   const emp = req.body;

//   const id = employees.length ? employees[employees.length - 1].id + 1 : 1;
//   employees.push({ id, ...emp });

//   console.log(res.status(201).json({ message: 'Employee added successfully' }));
// });

// app.get('/employees', (req, res) => {
//   res.json(employees);
// });

// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
// });
