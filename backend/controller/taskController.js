
const task = require('../modal/task');

exports.createTask = async (req, res) => {
    try {
        const { title, description, status, index } = req.body;
        const newTask = await task.create({ title, description, status, index });
        const io= req.app.get('socketio');
        if(io){
            io.emit('taskUpdated',newTask);
        }
        res.status(201).json(newTask)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getTask = async (req, res) => {
    try {
        const tasks = await task.find().sort('index');
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateTask = async (req, res) => {
    try {

        const updatedTask = await task.findByIdAndUpdate(req.params.id, req.body, { new: 'true' });
        const io = req.app.get('socketio');
        if (io) {
            console.log("Emitting update for task:", updatedTask._id);
            io.emit('taskUpdated', updatedTask);
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(400).json(error.message.error);
    }
};

