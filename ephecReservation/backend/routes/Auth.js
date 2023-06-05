import express from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import db from "../database.js";
import fetch from 'node-fetch';
//functions
import { generateToken, hashToken } from '../functions/Token.js'

const router = express.Router();

router.use(express.json());

//to check if the email already exists
router.get("/checkUpn", (req, res) => {
  let upn = req.query.upn;
  const query = "SELECT idTe FROM teacher WHERE upn = ?";
  db.query(query, [upn], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});


//to check if the user is admin
router.get("/checkAdmin", (req, res) => {
  let upn = req.query.upn;
  const query = "SELECT isAdmin = 1 AS isAdmin FROM teacher WHERE upn = ?";
  db.query(query, [upn], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});


// To add a user
router.post("/registration", async (req, res) => {
  const recaptchaResponse = req.body.recaptchaResponse;
  // Verify reCAPTCHA response
  try {
    const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const secretKey = '6LeKvCgmAAAAAC74RqgKMsynbnMxi5pVayVerd1s';

    const response = await fetch(verificationUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secretKey}&response=${recaptchaResponse}`
    });

    const data = await response.json();
    const { success } = data;


    if (!success) {
      return res.status(400).json({ error: 'reCAPTCHA verification failed.' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to verify reCAPTCHA.' });

  }

  // Generate a 10-character token
  const token = generateToken(10);
  // Hash it with bcrypt
  const hashedToken = hashToken(token, 10);

  // Begin the transaction
  db.beginTransaction(err => {
    if (err) {
      return res.json(err);
    }

    // Query INSERT INTO for the connection table
    const query1 = `INSERT INTO connection (upn, password) VALUES (?, ?)`;
    const values1 = [req.body.upn, req.body.password];

    // Execute the first query
    db.query(query1, values1, (err, result1) => {
      if (err) {
        db.rollback(() => {
          return res.json(err);
        });
      }

      // Query INSERT INTO for the teacher table
      const query2 = `INSERT INTO teacher (name, upn, session_id, isAdmin) VALUES (?, ?, ?, ?)`;
      const values2 = [req.body.name, req.body.upn, hashedToken, 0];

      // Execute the second query
      db.query(query2, values2, (err, result2) => {
        if (err) {
          db.rollback(() => {
            return res.json(err);
          });
        }

        // Commit the transaction
        db.commit(err => {
          if (err) {
            db.rollback(() => {
              return res.json(err);
            });
          }

          return res.json("User added successfully.");
        });
      });
    });
  });
});



//to log in an user
router.post('/login', async (req, res) => {
  const recaptchaResponse = req.body.recaptchaResponse;

  // Verify reCAPTCHA response
  try {
    const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const secretKey = '6LeKvCgmAAAAAC74RqgKMsynbnMxi5pVayVerd1s';

    const response = await fetch(verificationUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secretKey}&response=${recaptchaResponse}`
    });

    const data = await response.json();
    const { success } = data;

    if (!success) {
      return res.status(400).json({ error: 'reCAPTCHA verification failed.' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to verify reCAPTCHA.' });
  }

  const { upn, password } = req.body;
  try {
    const user = await new Promise((resolve, reject) => {
      const query = `
        SELECT teacher.upn, password, teacher.isAdmin 
        FROM connection JOIN teacher ON connection.upn = teacher.upn
        WHERE teacher.upn = ?`;

      db.query(query, [upn], (error, results) => {
        if (error) {
          reject(error);
        } else if (results.length === 0) {
          reject(new Error('User not found'));
        } else {
          const user = results[0];
          const isAdmin = user.isAdmin;
          bcrypt.compare(password, user.password, (error, isMatch) => {
            if (error) {
              reject(error);
            } else if (!isMatch) {
              reject(new Error('Incorrect password'));
            } else {
              const token = uuidv4();
              // Store token in the user's database record
              db.query(
                'UPDATE teacher SET session_id = ? WHERE upn = ?',
                [token, upn],
                (error, results) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve({ user, token, isAdmin });
                  }
                }
              );
            }
          });
        }
      });
    });

    // Return token and user object
    res.json({ token: user.token, upn: upn, isAdmin: user.isAdmin });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});


//to update the token of an user with a variable token
router.put("/token", (req, res) => {
  // generate a 10-character token
  const token = generateToken(10);
  // hash it with bcrypt
  const hashedToken = hashToken(token, 10);
  const query = `
    UPDATE teacher
    SET session_id=?
    WHERE upn = ?`;
  db.query(query, [hashedToken, req.body.upn], (err, data) => {
    if (err) return res.json(err);
    return res.json("Token updated successfully.");
  });
});


export default router;
