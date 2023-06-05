import express from "express";
import db from "../database.js";
const router = express.Router();


router.use(express.json());


// to get information about all rooms by implantation
router.get("/byImplantation", (req, res) => {
              let implantation = req.query.implantation;
              const query = `
                SELECT DISTINCT room.idRo, room.name, description
                FROM ephecreservation.implantation
                INNER JOIN ephecreservation.room ON room.idIm = implantation.idIm
                WHERE implantation.idIm = ?
              `;

              db.query(query, [implantation], (err, data) => {
                            if (err) return res.json(err)
                            return res.json(data)
              })
})

// to get the name of a room
router.get("/", (req, res) => {
              let idRo = req.query.idRo;
              const query = `
                SELECT DISTINCT room.name
                FROM ephecreservation.room
                WHERE room.idRo = ?
              `;

              db.query(query, [idRo], (err, data) => {
                            if (err) return res.json(err)
                            return res.json(data)
              })
})

export default router;