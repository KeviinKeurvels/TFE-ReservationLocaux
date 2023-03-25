import express from "express";
import cors from "cors";
import db from "../database.js";

const router = express.Router();

router.use(express.json());
router.use(cors());

//to get information about all implantations
router.get("/", (req,res)=>{
              const query = "SELECT * FROM implantation";
              db.query(query,(err,data)=>{
                            if(err) return res.json(err)
                            return res.json(data)
              })
})

export default router;