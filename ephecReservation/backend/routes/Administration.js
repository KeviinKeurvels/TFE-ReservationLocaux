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
//to get all users that are not admin
router.get("/getAllUsersThatAreNotAdmin", (req, res) => {
  const query = "SELECT idTe, name FROM teacher WHERE isAdmin=0";
  db.query(query, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})
//to get all users that are admin
router.get("/getAllUsersThatAreAdmin", (req, res) => {
  const query = "SELECT idTe, name FROM teacher WHERE isAdmin=1";
  db.query(query, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})
//to change the value of isAdmin for a user
router.put("/changeIsAdminForAUser", (req, res) => {
  const query = `
    UPDATE teacher
    SET isAdmin=?
    WHERE idTe = ?`;

  db.query(query, [req.body.isAdmin, req.body.idTe], (err, data) => {
    if (err) return res.json(err);
    return res.json("User updated successfully.");
  });
});

////////////////RESERVATIONS
// to add a new reservation for a user
router.post("/addReservation", (req, res) => {
  const query = `
    INSERT INTO reservation (title, day, hourBegin, hourEnd, idTe, idRo, room_unavailable) 
    VALUES (?, ?, ?, ?, ?, ?, 0)`;

  const values = [
    req.body.title,
    req.body.day,
    req.body.hourBegin,
    req.body.hourEnd,
    req.body.idTe,
    req.body.idRo
  ];

  db.query(query, values, (err, data) => {
    if (err) return res.json(err);
    return res.json("Reservation added successfully.");
  });
});
// to add a new reservation for a user
router.post("/addAnUnavailability", (req, res) => {
  const query = `
    INSERT INTO reservation (title, day, hourBegin, hourEnd, idTe, idRo, room_unavailable, isAnUnavailability) 
    VALUES (?, ?, ?, ?, (SELECT idTe FROM teacher WHERE upn=?), ?, 0, 1)`;

  const values = [
    req.body.title,
    req.body.day,
    req.body.hourBegin,
    req.body.hourEnd,
    req.body.upn,
    req.body.idRo
  ];

  db.query(query, values, (err, data) => {
    if (err) return res.json(err);
    return res.json("Unavailability added successfully.");
  });
});
//to update a reservation
router.put("/updateOne", (req, res) => {
  const query = `
    UPDATE reservation
    SET title=?, day=?, hourBegin=?, hourEnd=?
    WHERE idRe = ?`;

  const values = [
    req.body.title,
    req.body.day,
    req.body.hourBegin,
    req.body.hourEnd,
    req.body.idRe
  ];

  db.query(query, values, (err, data) => {
    if (err) return res.json(err);
    return res.json("Reservation updated successfully.");
  });
});

//to delete a reservation
router.delete("/deleteOne", (req, res) => {
  const reservationId = req.body.id;
  const query = `
    DELETE FROM reservation WHERE idRe = ?`;

  db.query(query, [reservationId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Reservation has been deleted successfully.");
  });
});

//to suspend all reservations for a day and a period
router.put("/suspendAllReservationsForAPeriod", (req, res) => {
  const query = `
    UPDATE reservation
    SET room_unavailable = 1
    WHERE day = ? 
    AND ((hourBegin >= ? AND hourBegin < ?) 
    OR (hourEnd > ? AND hourEnd <= ?))
    AND idRo = ?`;

  const values = [
    req.body.day,
    req.body.hourBegin,
    req.body.hourEnd,
    req.body.hourBegin,
    req.body.hourEnd,
    req.body.idRo
  ];

  db.query(query, values, (err, data) => {
    if (err) return res.json(err);
    return res.json("Reservations have been suspended successfully.");
  });
});

//to enable all reservations for a day and a period
router.put("/enableAllReservationsForAPeriod", (req, res) => {
  const query = `
    UPDATE reservation
    SET room_unavailable = 0
    WHERE day = ? 
    AND ((hourBegin >= ? AND hourBegin < ?) 
    OR (hourEnd > ? AND hourEnd <= ?))
    AND idRo = ?`;

  const values = [
    req.body.day,
    req.body.hourBegin,
    req.body.hourEnd,
    req.body.hourBegin,
    req.body.hourEnd,
    req.body.idRo
  ];

  db.query(query, values, (err, data) => {
    if (err) return res.json(err);
    return res.json("Reservations have been enabled successfully.");
  });
});

//to delete all reservations for a room
router.delete("/deleteAllReservationsForARoom", (req, res) => {
  const query = `
    DELETE FROM reservation 
    WHERE idRo = ?`;

  const idRo = req.body.idRo;

  db.query(query, [idRo], (err, data) => {
    if (err) return res.json(err);
    return res.json("Reservations have been deleted successfully.");
  });
});

//to get the count of reservations per day
router.get("/getCountReservation", (req, res) => {
  let idRo = req.query.idRo;
  let date = req.query.date;

  const query = `
    SELECT d.day, COUNT(r.idRo) AS count
    FROM (
      SELECT DATE_SUB(?, INTERVAL n DAY) AS day
      FROM (
        SELECT a.N + b.N * 10 + 1 AS n
        FROM (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) AS a
        CROSS JOIN (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) AS b
      ) AS numbers
      WHERE n < 8
    ) AS d
    LEFT JOIN reservation_deleted AS r ON d.day = r.day AND r.idRo = ?
    GROUP BY d.day
    ORDER BY d.day`;

  const values = [date, idRo];

  db.query(query, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});


////////////////IMPLANTATIONS
// to add a new implantation
router.post("/implantation", (req, res) => {
  const query = `
    INSERT INTO implantation (name) 
    VALUES (?)`;

  const name = req.body.name;

  db.query(query, [name], (err, data) => {
    if (err) return res.json(err);
    return res.json("Implantation added successfully.");
  });
});

// to delete an implantation
router.delete("/implantation", (req, res) => {
  const query = `
    DELETE FROM implantation 
    WHERE idIm = ?`;

  const idIm = req.body.idIm;

  db.query(query, [idIm], (err, data) => {
    if (err) return res.json(err);
    return res.json("Implantation has been deleted successfully.");
  });
});

// to modify an implantation
router.put("/implantation", (req, res) => {
  const query = `
    UPDATE implantation
    SET name = ?
    WHERE idIm = ?`;

  const name = req.body.name;
  const idIm = req.body.idIm;

  db.query(query, [name, idIm], (err, data) => {
    if (err) return res.json(err);
    return res.json("Implantation updated successfully.");
  });
});



////////////////ROOMS
// to add a new room
router.post("/room", (req, res) => {
  const query = `
    INSERT INTO room (name, description, idIm) 
    VALUES (?, ?, ?)`;

  const name = req.body.name;
  const description = req.body.description;
  const idIm = req.body.idIm;

  db.query(query, [name, description, idIm], (err, data) => {
    if (err) return res.json(err);
    return res.json("Room added successfully.");
  });
});

// to delete a room
router.delete("/room", (req, res) => {
  const query = `
    DELETE FROM room 
    WHERE idRo = ?`;

  const idRo = req.body.idRo;

  db.query(query, [idRo], (err, data) => {
    if (err) return res.json(err);
    return res.json("Room has been deleted successfully.");
  });
});

// to modify a room
router.put("/room", (req, res) => {
  const query = `
    UPDATE room
    SET name = ?, description = ?
    WHERE idRo = ?`;

  const name = req.body.name;
  const description = req.body.description;
  const idRo = req.body.idRo;

  db.query(query, [name, description, idRo], (err, data) => {
    if (err) return res.json(err);
    return res.json("Room updated successfully.");
  });
});

export default router;
