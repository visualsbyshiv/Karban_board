
const handleDelete = async (id)=>{
    try{

    
if (window.confirm('delete it')){
    await axios.delete(`https://karban-board.onrender.com/api/tasks/${id}`);
    setTasks((prev )=>prev.filter((t) => t._id !==id));
    alert('Task Deleted');
}
    }catch(err){
        alert('not done yet');
    }

};
return(
    <div>
        <h3>{task.tittle}</h3>
<button style={{color:'red'}} onClick={()=>handleDelete(task._id)}>Delete</button>
</div>
);

export default TaskCard;