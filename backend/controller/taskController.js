
const task = require('../modal/task');


exports.createTask = async (req, res) => {
    try {
        const { title, description, status, index } = req.body;
        const newTask = await task.create({ title, description, status, index, user: req.user.id });
        const io = req.app.get('socketio');
        if (io) {
            io.emit('taskUpdated', newTask);
        }
        res.status(201).json(newTask)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getTask = async (req, res) => {
    try {
        const tasks = await task.find({ user: req.user.id }).sort('index');
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateTask = async (req, res) => {
    try {

        const foundTask = await task.findById(req.params.id  );
        if (!foundTask) return res.status(404).json({ message: "Task not found" });
        if (foundTask.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const updatedTask = await task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        const io = req.app.get('socketio');
        if (io) {
            console.log("Emitting update for task:", updatedTask._id);
            io.emit('taskUpdated', updatedTask);
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(400).json( {message: error.message});
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const foundTask = await task.findById(req.params.id);
        if (!foundTask) {
            return res.status(400).json({ message: "didnot get Task" });
        }
        if (foundTask.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'This task in not your' });
        }
        await foundTask.deleteOne();
        res.status(200).json({ message: 'Task Deleted' });
    } catch (err) {
        res.status(500).json({ error:err.message});
    };

}

