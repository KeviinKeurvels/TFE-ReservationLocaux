import express from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import db from "../database.js";
//functions
import {generateToken, hashToken} from '../functions/Token.js'

const router = express.Router();

router.use(express.json());

//to check if the email already exists
router.get("/checkUpn", (req, res) => {
  let upn=req.query.upn;
  const query = `SELECT idTe FROM teacher WHERE upn=${upn}`
  db.query(query, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})

// to add an user
router.post("/registration", (req, res) => {
  // generate a 10-character password
  const token = generateToken(10);
  // hash it with bcrypt
  const hashedToken = hashToken(token, 10);
  const query = `
              INSERT INTO teacher (name,upn,password,session_id, isAdmin) 
              VALUES("${req.body.name}",'${req.body.upn}','${req.body.password}','${hashedToken}',0)
              `;

  db.query(query, (err, data) => {
    if (err) return res.json(err)
    return res.json("User added successfully.")
  })
})

//to log in an user
router.post('/login', async (req, res) => {
  const { upn, password } = req.body;
  try {
    const user = await new Promise((resolve, reject) => {
      db.query(`SELECT upn, password, isAdmin FROM teacher WHERE upn='${upn}'`, (error, results) => {
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
                    resolve({ user, token, isAdmin});
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
  // generate a 10-character password
  const token = generateToken(10);
  // hash it with bcrypt
  const hashedToken = hashToken(token, 10);
  const query = `
              UPDATE teacher
              SET session_id="${hashedToken}"
              WHERE upn = "${req.body.upn}"
              `;
  db.query(query, (err, data) => {
    if (err) return res.json(err)
    return res.json("Token updated successfully.")
  })
})

export default router;
