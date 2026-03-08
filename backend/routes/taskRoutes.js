const express = require('express');
const routes = express.Router();
const { createTask, getTask, updateTask } = require('../controller/taskController');
routes.post('/', createTask);
routes.get('/', getTask);
routes.patch('/:id',updateTask);

routes.delete('/:id',async (req,res)=>{
try{
    await task.findByIdAndDelete(req.params.id);
    res.status(200).json({message:'succesfully Deleted'});
}catch(error){
    res.status(500).json(error);
}
})
module.exports = routes;