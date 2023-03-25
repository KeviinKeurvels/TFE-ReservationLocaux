import express from "express";
//import files
import reservationsRouter from './routes/Reservations.js';
import roomsRouter from './routes/Rooms.js'
import implantationsRouter from './routes/Implantations.js'

const app = express()


app.listen(8800, ()=>{
              console.log('Server ready on port 8800')
})


//Routes
app.use('/reservations', reservationsRouter);
app.use('/rooms', roomsRouter);
app.use('/implantations', implantationsRouter);


