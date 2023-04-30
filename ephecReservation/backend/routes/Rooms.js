import express from "express";
import db from "../database.js";
const router = express.Router();


router.use(express.json());


//to get information about all rooms
router.get("/byImplantation", (req,res)=>{
              let implantation = req.query.implantation;
              const query = `
              SELECT DISTINCT room.idRo, room.name, description

              FROM ephecreservation.implantation  
              inner join ephecreservation.room on room.idIm=implantation.idIm 
              WHERE implantation.idIm=${implantation}

              `;
              db.query(query,(err,data)=>{
                            if(err) return res.json(err)
                            return res.json(data)
              })
})

//to get the name of a room
router.get("/", (req,res)=>{
              let idRo = req.query.idRo;
              const query = `
              SELECT DISTINCT room.name

              FROM ephecreservation.room  
              WHERE room.idRo=${idRo}

              `;
              db.query(query,(err,data)=>{
                            if(err) return res.json(err)
                            return res.json(data)
              })
})

export default router;