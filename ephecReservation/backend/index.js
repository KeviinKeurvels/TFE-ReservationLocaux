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
              TIME_FORMAT(hourEnd, '%H:%i') as hourEnd, reservation.idRe, title 

              FROM ephecreservation.reservation  
              inner join ephecreservation.room_reservation on reservation.idRe=room_reservation.idRe 
              inner join ephecreservation.room on room.idRo=room_reservation.idRo 

              WHERE day=${day} AND room.name=${room} ORDER BY hourBegin
              `;

              db.query(query,(err,data)=>{
                            if(err) return res.json(err)
                            return res.json(data)
              })
})

//to get information about one reservations
app.get("/reservation", (req,res)=>{
              let id = req.query.id;
              const query = "SELECT * FROM reservation WHERE idRe="+id;
              db.query(query,(err,data)=>{
                            if(err) return res.json(err)
                            return res.json(data)
              })
})



///////////////////////////////////////// ROOM
//to get information about all rooms
app.get("/rooms/byImplantation", (req,res)=>{
              let implantation = req.query.implantation;
              const query = `
              SELECT DISTINCT room.idRo, room.name, description

              FROM ephecreservation.implantation  
              inner join ephecreservation.room_implantation on implantation.idIm=room_implantation.idIm 
              inner join ephecreservation.room on room.idRo=room_implantation.idRo 
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