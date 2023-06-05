import express from "express";
import db from "../database.js";

const router = express.Router();


router.use(express.json());


//////////////////GENERAL
//to get all reservations
router.get("/", (req, res) => {
  const query = "SELECT * FROM reservation"
  db.query(query, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})

//to get all reservations for a day
router.get("/byRoomAndDay", (req, res) => {
  let day = req.query.day;
  let room = req.query.room;
  const query = `
    SELECT DISTINCT TIME_FORMAT(hourBegin, '%H:%i') as hourBegin,
    TIME_FORMAT(hourEnd, '%H:%i') as hourEnd, reservation.idRe, title,
    teacher.name as teacherName, day, upn, room_unavailable, reservation.idRo as idRo,
    isAnUnavailability

    FROM teacher  
    inner join reservation on teacher.idTe=reservation.idTe 
    inner join room on room.idRo=reservation.idRo 

    WHERE day=? AND room.idRo=? ORDER BY hourBegin
  `;

  db.query(query, [day, room], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});


//to get all reservations for a day
router.get("/byRoomAndDayAndHours", (req, res) => {
  let day = req.query.day;
  let room = req.query.room;
  let hourBegin = req.query.hourBegin;
  let hourEnd = req.query.hourEnd;
  const query = `
    SELECT idRe
    FROM reservation 
    INNER JOIN room ON room.idRo = reservation.idRo 
    WHERE day = ? AND room.idRo = ? AND hourBegin <= ? AND hourEnd >= ?
  `;

  db.query(query, [day, room, hourEnd, hourBegin], (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})


// to get information about one reservation
router.get("/getOne", (req, res) => {
  let id = req.query.id;
  const query = "SELECT * FROM reservation WHERE idRe = ?";
  db.query(query, [id], (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})

// to add a new reservation
router.post("/", (req, res) => {
  const query = `
    INSERT INTO reservation (title, day, hourBegin, hourEnd, idTe, idRo, room_unavailable) 
    VALUES (?, ?, ?, ?, (SELECT idTe FROM teacher WHERE upn = ?), ?, 0)
  `;

  const values = [
    req.body.title,
    req.body.day,
    req.body.hourBegin,
    req.body.hourEnd,
    req.body.upn,
    req.body.idRo
  ];

  db.query(query, values, (err, data) => {
    if (err) return res.json(err)
    return res.json("Reservation added successfully.")
  })
})

// to update a reservation
router.put("/updateOne", (req, res) => {
  const query = `
    UPDATE reservation
    SET title = ?, day = ?, hourBegin = ?, hourEnd = ?
    WHERE idRe = ?
  `;

  const values = [
    req.body.title,
    req.body.day,
    req.body.hourBegin,
    req.body.hourEnd,
    req.body.idRe
  ];

  db.query(query, values, (err, data) => {
    if (err) return res.json(err)
    return res.json("Reservation updated successfully.")
  })
})


// to delete a reservation
router.delete("/deleteOne", (req, res) => {
  const reservationId = req.body.id;
  const query = `
    DELETE FROM reservation WHERE idRe = ?
  `;

  db.query(query, [reservationId], (err, data) => {
    if (err) return res.json(err)
    return res.json("Reservation has been deleted successfully.")
  });
});

//////////////////FOR AN USER
// to get all reservations for a user
router.get("/forAnUser", (req, res) => {
  let upnTeacher = req.query.upnTeacher;
  const query = `
    SELECT DISTINCT TIME_FORMAT(hourBegin, '%H:%i') as hourBegin,
    TIME_FORMAT(hourEnd, '%H:%i') as hourEnd, reservation.idRe, title, teacher.name as teacherName,
    day, room.name as roomName, implantation.name as implantationName, room_unavailable, reservation.idRo as idRo,
    isAnUnavailability

    FROM teacher  
    INNER JOIN reservation ON teacher.idTe = reservation.idTe 
    INNER JOIN room ON room.idRo = reservation.idRo 
    INNER JOIN implantation ON room.idIm = implantation.idIm

    WHERE teacher.upn = ? ORDER BY day, hourBegin, roomName
  `;

  db.query(query, [upnTeacher], (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})

/////////////////FOR ADMINISTRATOR
// to delete all reservations for a day and a period
router.delete("/deleteAllReservationsForAPeriod", (req, res) => {
  const query = `
    DELETE FROM reservation 
    WHERE day = ? 
    AND ((hourBegin >= ? AND hourBegin < ?) 
    OR (hourEnd > ? AND hourEnd <= ?))
  `;

  const values = [
    req.body.day,
    req.body.hourBegin,
    req.body.hourEnd,
    req.body.hourBegin,
    req.body.hourEnd
  ];

  db.query(query, values, (err, data) => {
    if (err) return res.json(err)
    return res.json("Reservations have been deleted successfully.")
  });
});


export default router;
