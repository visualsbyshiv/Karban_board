const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db')
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/auth');
const { callbackify } = require('util');


dotenv.config();
connectDB();

const app = express();
const allowedOrigins = [
    "https://karban-board.vercel.app",
    "http://localhost:5173"
];

app.use(cors({
    
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
            callback(null, true);
        } else {
            callback(new Error("not allowed by corsa"));
        }
    },

    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
}));

app.use(express.json());



const server = http.createServer(app);
const io = new Server(server, {

    cors: {
      origin:(origin,callback)=>{
        callback(null, true);
      },
      methods:["GET","PODT"],
      credentials:true
    },
    transports: ['websocket', 'polling'],
    allowEIO3: true
});


app.set('socketio', io);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/api/test', (req, res) => {
    res.json({ message: " Server is live", });
});
app.get('/', (req, res) => {
    res.send('server connect to db');
});
io.on('connection', (socket) => {
    console.log(`USER CONNECTED ${socket.id}`);
    socket.on("task moved", (data) => {
        socket.broadcast.emit('Board Update', data);
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected');
    });
});




const PORT = process.env.PORT || 8080;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server run on ${PORT}`);
});


