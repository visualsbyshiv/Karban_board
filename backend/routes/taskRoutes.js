const Task =require('../modal/task');

const express = require('express');
const routes = express.Router();
const { createTask, getTask, updateTask } = require('../controller/taskController');
routes.post('/', createTask);
routes.get('/', getTask);
routes.patch('/:id',updateTask);

routes.delete('/:id',async (req,res)=>{
try{

    const deleteTask = await Task.findByIdAndDelete(req.params.id);
    if(!deleteTask){
    res.status().json({message:'Task not delete Deleted'});
    }res.status(200).json({message:'Succesfully Delete'})
}catch(error){
    res.status(500).json(error);
}
})
module.exports = routes;