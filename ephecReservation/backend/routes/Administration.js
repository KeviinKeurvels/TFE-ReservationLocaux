import express from "express";
import db from "../database.js";

const router = express.Router();


router.use(express.json());



/////////////////FOR ADMINISTRATOR
////////////////RESERVATIONS
//to delete all reservations for a day and a period
router.delete("/deleteAllReservationsForAPeriod", (req, res) => {
  const query = `
  DELETE FROM reservation 
  WHERE day = '${req.body.day}' 
  AND ((hourBegin >= '${req.body.hourBegin}' AND hourBegin<'${req.body.hourEnd}') 
  OR (hourEnd > '${req.body.hourBegin}' AND hourEnd<='${req.body.hourEnd}')) AND idRo = (SELECT idRo FROM room WHERE name = '${req.body.nameRoom}');       
  `;

  db.query(query, (err, data) => {
    if (err) return res.json(err)
    return res.json("Reservations have been deleted successfully.")
  });
});

router.delete("/deleteAllReservationsForARoom", (req, res) => {
  const query = `
  DELETE FROM reservation 
  WHERE idRo = '${req.body.idRo}';
  `;

  db.query(query, (err, data) => {
    if (err) return res.json(err)
    return res.json("Reservations have been deleted successfully.")
  });
});

////////////////ROOMS
// to add a new reservation
router.post("/room", (req, res) => {
  const query = `
              INSERT INTO room (name,description,idIm) 
              VALUES('${req.body.name}','${req.body.description}',${req.body.idIm})
              `;

  db.query(query, (err, data) => {
    if (err) return res.json(err)
    return res.json("Room added successfully.")
  });
});

router.delete("/room", (req, res) => {
  const query = `
  DELETE FROM room 
  WHERE idRo = '${req.body.idRo}';
  `;

  db.query(query, (err, data) => {
    if (err) return res.json(err)
    return res.json("Room has been deleted successfully.")
  });
});

export default router;
