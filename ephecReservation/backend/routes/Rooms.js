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
              WHERE implantation.name=${implantation}

              `;
              db.query(query,(err,data)=>{
                            if(err) return res.json(err)
                            return res.json(data)
              })
})

export default router;