import express from "express";
import cors from "cors";
//import files
import reservationsRouter from './routes/Reservations.js';
import roomsRouter from './routes/Rooms.js'
import implantationsRouter from './routes/Implantations.js'
import loginRouter from './routes/Auth.js'
import administrationRouter from './routes/Administration.js'
//middlewares
import isAuthenticated from './middlewares/authMiddleware.js';
import isAuthenticatedAsAdmin from './middlewares/authMiddlewareAdmin.js';

const app = express()
app.use(cors()); // Enable CORS for all origins

app.listen(8800, ()=>{
              console.log('Server ready on port 8800')
})

app.use(express.json())

//Routes
app.use('/auth', loginRouter);
app.use('/reservations', isAuthenticated, reservationsRouter);
app.use('/rooms', isAuthenticated, roomsRouter);
app.use('/implantations', isAuthenticated, implantationsRouter);
app.use('/admin', isAuthenticatedAsAdmin, administrationRouter);


