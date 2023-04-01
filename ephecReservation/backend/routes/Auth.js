import express from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import db from "../database.js";

const router = express.Router();

router.use(express.json());

router.post('/login', async (req, res) => {
  const { upn, password } = req.body;
  console.log(upn, password)
  try {
    const user = await new Promise((resolve, reject) => {
      db.query(`SELECT * FROM teacher WHERE upn='${upn}'`, (error, results) => {
        console.log(results)
        if (error) {
          reject(error);
        } else if (results.length === 0) {
          reject(new Error('User not found'));
        } else {
          const user = results[0];

          bcrypt.compare(password, user.password, (error, isMatch) => {
            if (error) {
              console.log(error)
              reject(error);
            } else if (!isMatch) {
              reject(new Error('Incorrect password'));
              console.log("hhh")
            } else {
              const token = uuidv4();

              // Store token in the user's database record
              db.query(
                'UPDATE teacher SET session_id = ? WHERE upn = ?',
                [token, upn],
                (error, results) => {
                  if (error) {
                    console.error(error);
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
