const Task =require('../modal/task');
const express = require('express');
const routes = express.Router();
const { createTask, getTask, updateTask,deleteTask } = require('../controller/taskController');
const auth=require('../middleware/auth');

routes.get('/', auth, getTask);
routes.post('/', auth, createTask);
routes.patch('/:id', auth, updateTask);
routes.delete('/:id', auth, deleteTask);


module.exports = routes;