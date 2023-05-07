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
              INSERT INTO reservation (title,day,hourBegin,hourEnd,idTe, idRo, room_unavailable) 
              VALUES("${req.body.title}",'${req.body.day}','${req.body.hourBegin}','${req.body.hourEnd}',
              ${req.body.idTe},${req.body.idRo},0)
              `;

  db.query(query, (err, data) => {
    if (err) return res.json(err)
    return res.json("Reservation added successfully.")
  })
})
// to add a new reservation for a user
router.post("/addAnUnavailability", (req, res) => {
  const query = `
              INSERT INTO reservation (title,day,hourBegin,hourEnd,idTe, idRo, room_unavailable, isAnUnavailability) 
              VALUES("${req.body.title}",'${req.body.day}','${req.body.hourBegin}','${req.body.hourEnd}',
              (SELECT idTe FROM teacher WHERE upn='${req.body.upn}'),${req.body.idRo},0,1)
              `;

  db.query(query, (err, data) => {
    if (err) return res.json(err)
    return res.json("Unavailability added successfully.")
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

//to suspend all reservations for a day and a period
router.put("/suspendAllReservationsForAPeriod", (req, res) => {
  const query = `
  UPDATE reservation
  SET room_unavailable=1 
  WHERE day = '${req.body.day}' 
  AND ((hourBegin >= '${req.body.hourBegin}' AND hourBegin<'${req.body.hourEnd}') 
  OR (hourEnd > '${req.body.hourBegin}' AND hourEnd<='${req.body.hourEnd}')) AND idRo = ${req.body.idRo};       
  `;

  db.query(query, (err, data) => {
    if (err) return res.json(err)
    return res.json("Reservations have been suspended successfully.")
  });
});

//to enable all reservations for a day and a period
router.put("/enableAllReservationsForAPeriod", (req, res) => {
  const query = `
  UPDATE reservation
  SET room_unavailable=0 
  WHERE day = '${req.body.day}' 
  AND ((hourBegin >= '${req.body.hourBegin}' AND hourBegin<'${req.body.hourEnd}') 
  OR (hourEnd > '${req.body.hourBegin}' AND hourEnd<='${req.body.hourEnd}')) AND idRo = ${req.body.idRo};       
  `;

  db.query(query, (err, data) => {
    if (err) return res.json(err)
    return res.json("Reservations have been enabled successfully.")
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

//to get the count of reservations per day
router.get("/getCountReservation", (req, res) => {
  let idRo=req.query.idRo;
  let date=req.query.date;
  const query = `
  SELECT d.day, COUNT(r.idRo) AS count
  FROM (
    SELECT DATE_SUB(${date}, INTERVAL n DAY) AS day
    FROM (
      SELECT a.N + b.N * 10 + 1 AS n
      FROM (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) AS a
      CROSS JOIN (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) AS b
    ) AS numbers
    WHERE n < 8
  ) AS d
  LEFT JOIN reservation_deleted AS r ON d.day = r.day AND r.idRo = ${idRo}
  GROUP BY d.day
  ORDER BY d.day;
  ;`
  db.query(query, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})


////////////////IMPLANTATIONS
// to add a new implantation
router.post("/implantation", (req, res) => {
  const query = `
              INSERT INTO implantation (name) 
              VALUES('${req.body.name}')
              `;

  db.query(query, (err, data) => {
    if (err) return res.json(err)
    return res.json("Implantation added successfully.")
  });
});

// to delete an implantation
router.delete("/implantation", (req, res) => {
  const query = `
  DELETE FROM implantation 
  WHERE idIm = '${req.body.idIm}';
  `;

  db.query(query, (err, data) => {
    if (err) return res.json(err)
    return res.json("Implantation has been deleted successfully.")
  });
});

// to modify an implantation
router.put("/implantation", (req, res) => {
  const query = `
              UPDATE implantation
              SET name="${req.body.name}"
              WHERE idIm = ${req.body.idIm}
              `;

  db.query(query, (err, data) => {
    if (err) return res.json(err)
    return res.json("Implantation updated successfully.")
  })
})



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
