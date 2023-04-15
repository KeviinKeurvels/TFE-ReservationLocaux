import express from "express";
import db from "../database.js";

const router = express.Router();


router.use(express.json());



/////////////////FOR ADMINISTRATOR
////////////////USERS
//to get all users
router.get("/getAllUsers", (req, res) => {
  const query = "SELECT idTe, name FROM teacher";
  db.query(query, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})

////////////////RESERVATIONS
// to add a new reservation for a user
router.post("/addReservation", (req, res) => {
  const query = `
              INSERT INTO reservation (title,day,hourBegin,hourEnd,idTe, idRo) 
              VALUES("${req.body.title}",'${req.body.day}','${req.body.hourBegin}','${req.body.hourEnd}',
              ${req.body.idTe},(SELECT idRo FROM room WHERE name='${req.body.nameRoom}'))
              `;

  db.query(query, (err, data) => {
    if (err) return res.json(err)
    return res.json("Reservation added successfully.")
  })
})
//to update a reservation
router.put("/updateOne", (req, res) => {
  const query = `
              UPDATE reservation
              SET title="${req.body.title}",day='${req.body.day}',hourBegin='${req.body.hourBegin}',
              hourEnd='${req.body.hourEnd}'
              WHERE idRe = ${req.body.idRe}
              `;

  db.query(query, (err, data) => {
    if (err) return res.json(err)
    return res.json("Reservation updated successfully.")
  })
})

//to delete a reservation
router.delete("/deleteOne", (req, res) => {
  const reservationId = req.body.id;
  const query = `
              DELETE FROM reservation WHERE idRe = ${reservationId}
              `;

  db.query(query, (err, data) => {
    if (err) return res.json(err)
    return res.json("Reservation has been deleted successfully.")
  });
});

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

//to delete all reservations for a room
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
// to add a new room
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

// to delete a room
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

// to modify a room
router.put("/room", (req, res) => {
  const query = `
              UPDATE room
              SET name="${req.body.name}",description='${req.body.description}'
              WHERE idRo = ${req.body.idRo}
              `;

  db.query(query, (err, data) => {
    if (err) return res.json(err)
    return res.json("Room updated successfully.")
  })
})

export default router;
