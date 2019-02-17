const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const db = require('./database/dbHelpers');
const customerRouter = require('./customerRoutes');
const workerRouter = require('./workerRoutes');

const server = express();
const secret = process.env.SECRET;

const authorize = (req, res, next) => {
  const token = req.headers.authorization;
  token
    ? jwt.verify(token, secret, (err, decoded) => {
        console.log(decoded);
        err
          ? res.status(401).json({ message: 'Invalid token received' })
          : next();
      })
    : res.status(401).json({ message: 'No token received' });
};

const generateToken = user => {
  const payload = {
    accountType: user.accountType,
    username: user.username,
    id: user.id
  };
  const options = {
    expiresIn: '3h'
  };

  return jwt.sign(payload, secret, options);
};

server.use(express.json());
server.use(cors());

//sanity check endpoint
server.get('/', (req, res) => {
  res.send("It's Alive!!");
});

//*************************************************/
// Admin endpoints to see what is on the DBs
// server.get('/customers', (req, res) => {
//   db.getCustomers().then(cus => {
//     res.json(cus);
//   });
// });

// server.get('/workers', (req, res) => {
//   db.getAllWorkersInfo().then(workers => {
//     res.json(workers);
//   });
// });
//**************************************************

// register endpoint
server.post('/api/register', async (req, res) => {
  const user = req.body;
  const { username, password, accountType, fname, lname, jobTitle } = user;

  if (!(username && password && accountType && fname && lname && jobTitle)) {
    return res.status(400).send('Please fill in all required fields');
  }
  user.password = bcrypt.hashSync(user.password, 12);
  try {
    const response = await db.insertUser(user);
    res.status(201).json({ count: response.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.detail });
  }
});

// login endpoint
server.post('/api/login', async (req, res) => {
  const creds = req.body;
  try {
    const user = await db.findByUsername(creds.username);
    if (user && bcrypt.compareSync(creds.password, user.password)) {
      const token = generateToken(user);
      res.json({ id: user.id, token });
    } else {
      res.status(404).json({
        error: 'Invalid credentials were entered. Please try again.'
      });
    }
  } catch (err) {
    res.status(500).send('Error');
  }
});

// endpoint that will be used when a customer is logged in and wants to look through list of workers
server.use('/api/customer', authorize, customerRouter);

server.use('/api/worker', workerRouter);

module.exports = server;
