import express from "express";
import cors from "cors";
import db from "../database.js";

const router = express.Router();


router.use(express.json());
router.use(cors());


//////////////////GENERAL
//to get all reservations
router.get("/", (req,res)=>{
  const query = "SELECT * FROM reservation"
  db.query(query,(err,data)=>{
    if(err) return res.json(err)
    return res.json(data)
  })
})

//to get all reservations for a day
router.get("/byRoomAndDay", (req,res)=>{
  let day = req.query.day;
  let room = req.query.room;
  const query = `
    SELECT DISTINCT TIME_FORMAT(hourBegin, '%H:%i') as hourBegin,
    TIME_FORMAT(hourEnd, '%H:%i') as hourEnd, reservation.idRe, title, teacher.name as teacherName, day 

    FROM teacher  
    inner join reservation on teacher.idTe=reservation.idTe 
    inner join room on room.idRo=reservation.idRo 

    WHERE day=${day} AND room.name=${room} ORDER BY hourBegin
  `;

  db.query(query,(err,data)=>{
    if(err) return res.json(err)
    return res.json(data)
  })
})

//to get information about one reservations
router.get("/getOne", (req,res)=>{
  let id = req.query.id;
  const query = "SELECT * FROM reservation WHERE idRe="+id;
  db.query(query,(err,data)=>{
    if(err) return res.json(err)
    return res.json(data)
  })
})

// to add a new reservation
router.post("/", (req,res)=>{
              const query= `
              INSERT INTO reservation (title,day,hourBegin,hourEnd,idTe, idRo) 
              VALUES("${req.body.title}",'${req.body.day}','${req.body.hourBegin}','${req.body.hourEnd}','${req.body.idTe}',(SELECT idRo FROM ROOM WHERE name='${req.body.nameRoom}'))
              `;

              db.query(query, (err,data)=>{
                            if(err) return res.json(err)
                            return res.json("Reservation added successfully.")
              })
})

//to update a reservation
router.put("/updateOne", (req,res)=>{
              const query= `
              UPDATE reservation
              SET title="${req.body.title}",day='${req.body.day}',hourBegin='${req.body.hourBegin}',hourEnd='${req.body.hourEnd}'
              WHERE idRe = ${req.body.idRe}
              `;

              db.query(query, (err,data)=>{
                            if(err) return res.json(err)
                            return res.json("Reservation updated successfully.")
              })
})

//to delete a reservation
router.delete("/deleteOne",  (req,res)=>{
              const reservationId = req.body.id;
              const query= `
              DELETE FROM reservation WHERE idRe = ${reservationId}
              `;

              db.query(query, (err,data)=>{
                            if(err) return res.json(err)
                            return res.json("Reservation has been deleted successfully.")
              });
});



//////////////////FOR AN USER
//to get all reservations for an user
router.get("/forAnUser", (req,res)=>{
  let idTeacher = req.query.idTeacher;
  const query = `
  SELECT DISTINCT TIME_FORMAT(hourBegin, '%H:%i') as hourBegin,
  TIME_FORMAT(hourEnd, '%H:%i') as hourEnd, reservation.idRe, title, teacher.name as teacherName, day, room.name as roomName, implantation.name as implantationName

  FROM teacher  
  inner join reservation on teacher.idTe=reservation.idTe 
  inner join room on room.idRo=reservation.idRo 
  inner join implantation on room.idIm=implantation.idIm

  WHERE teacher.idTe=${idTeacher} ORDER BY day, hourBegin, roomName
  `;
  db.query(query,(err,data)=>{
                if(err) return res.json(err)
                return res.json(data)
  })
})

export default router;
