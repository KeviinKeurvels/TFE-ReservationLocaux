import express from "express";
import db from "../database.js";

const router = express.Router();


router.use(express.json());



/////////////////FOR ADMINISTRATOR
//to delete all reservations for a day and a period
router.delete("/deleteAllReservationsForAPeriod", (req, res) => {
  const query = `
  DELETE FROM reservation 
  WHERE day = '${req.body.day}' 
  AND ((hourBegin >= '${req.body.hourBegin}' AND hourBegin<'${req.body.hourEnd}') 
  OR (hourEnd > '${req.body.hourBegin}' AND hourEnd<='${req.body.hourEnd}'));       
  `;

  db.query(query, (err, data) => {
    if (err) return res.json(err)
    return res.json("Reservations have been deleted successfully.")
  });
});

export default router;
