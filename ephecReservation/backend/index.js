import express from "express";
import mysql from "mysql";
import cors from "cors";



const app = express()

const db= mysql.createConnection({
              host: "localhost",
              user: "root",
              password: "",
              database:"ephecreservation"
})

app.use(express.json());
app.use(cors())

app.listen(8800, ()=>{
              console.log('Server ready on port 8800')
})


///////////////////////////////////////// RESERVATION

//to get all reservations
app.get("/reservations", (req,res)=>{
              const query = "SELECT * FROM reservation"
              db.query(query,(err,data)=>{
                            if(err) return res.json(err)
                            return res.json(data)
              })
})

//to get all reservations for a day
app.get("/reservations/byRoomAndDay", (req,res)=>{
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
app.get("/reservations/getOne", (req,res)=>{
              let id = req.query.id;
              const query = "SELECT * FROM reservation WHERE idRe="+id;
              db.query(query,(err,data)=>{
                            if(err) return res.json(err)
                            return res.json(data)
              })
})

// to add a new reservation
app.post("/reservations", (req,res)=>{
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
app.put("/reservations/updateOne", (req,res)=>{
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
app.delete("/reservations/deleteOne",  (req,res)=>{
              const reservationId = req.body.id;
              const query= `
              DELETE FROM reservation WHERE idRe = ${reservationId}
              `;

              db.query(query, (err,data)=>{
                            if(err) return res.json(err)
                            return res.json("Reservation has been deleted successfully.")
              });
});



///////////////////////////////////////// ROOM
//to get information about all rooms
app.get("/rooms/byImplantation", (req,res)=>{
              let implantation = req.query.implantation;
              const query = `
              SELECT DISTINCT room.idRo, room.name, description

              FROM ephecreservation.implantation  
              inner join ephecreservation.room on room.idIm=implantation.idIm 
              WHERE implantation.name=${implantation}

              `;
              db.query(query,(err,data)=>{
                            if(err) return res.json(err)
                            return res.json(data)
              })
})


///////////////////////////////////////// IMPLANTATION
//to get information about all implantations
app.get("/implantations", (req,res)=>{
              const query = "SELECT * FROM implantation";
              db.query(query,(err,data)=>{
                            if(err) return res.json(err)
                            return res.json(data)
              })
})