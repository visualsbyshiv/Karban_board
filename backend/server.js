const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db')
const taskRoutes = require('./routes/taskRoutes');


dotenv.config();
connectDB();

const app = express();

app.use(cors());



const server = http.createServer(app);
const io = new Server(server, {

    cors: {
        origin: "*",
        methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    }
});
app.use(express.json());
app.set('socketio', io);
app.use('/api/tasks', taskRoutes);

io.on('connection', (socket) => {
    console.log(`USER CONNECTED ${socket.id}`);
    socket.on("task moved", (data) => {
        socket.broadcast.emit('Board Update', data);
    });

    socket.on('Disconnected', () => {
        console.log('User Discomnected');
    });
});

app.get('/', (req, res) => {
    res.send('server connect to db');
});

const PORT = process.env.PORT || 8080;

server.listen(PORT,'0.0.0.0', () => {
    console.log(`Server run on ${PORT}`);
});


