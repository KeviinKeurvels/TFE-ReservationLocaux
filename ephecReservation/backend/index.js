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
              console.log('Server ready')
})


//to get all reservations
app.get("/reservations", (req,res)=>{
              const query = "SELECT * FROM reservation"
              db.query(query,(err,data)=>{
                            if(err) return res.json(err)
                            return res.json(data)
              })
})

//to get all reservations for a day
app.get("/reservations/byDay", (req,res)=>{
              let day = req.query.day;
              const query = "SELECT TIME_FORMAT(hourBegin, '%H:%i') as hourBegin," 
              +" TIME_FORMAT(hourEnd, '%H:%i') as hourEnd, idRe, title  FROM "
              +"reservation WHERE day="+day+" ORDER BY hourBegin";
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


//to get information about all rooms
app.get("/rooms", (req,res)=>{
              const query = "SELECT * FROM room";
              db.query(query,(err,data)=>{
                            if(err) return res.json(err)
                            return res.json(data)
              })
})
