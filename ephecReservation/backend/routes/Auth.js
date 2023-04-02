import express from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import db from "../database.js";

const router = express.Router();

router.use(express.json());

//to get all reservations
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
  const query = `
              INSERT INTO teacher (name,upn,password,isAdmin) 
              VALUES("${req.body.name}",'${req.body.upn}','${req.body.password}',0)
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
      db.query(`SELECT * FROM teacher WHERE upn='${upn}'`, (error, results) => {
        if (error) {
          reject(error);
        } else if (results.length === 0) {
          reject(new Error('User not found'));
        } else {
          const user = results[0];

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
                    resolve({ user, token });
                  }
                }
              );
            }
          });
        }
      });
    });

    // Return token and user object
    res.json({ token: user.token, upn: upn });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

export default router;
