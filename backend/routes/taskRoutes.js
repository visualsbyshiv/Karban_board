const express = require('express');
const routes = express.Router();
const { createTask, getTask, updateTask } = require('../controller/taskController');
routes.post('/', createTask);
routes.get('/', getTask);
routes.patch('/:id',updateTask);
module.exports = routes;