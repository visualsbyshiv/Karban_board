
const BASE_URL = "https://karban-board.onrender.com"    
const API_URL = `${BASE_URL}/api/tasks`;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';

interface Task {
    _id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in-progress' | 'done';
    index: number;
}

const socket: Socket = io(BASE_URL);

const App: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState<string>("");
    const columns: Task['status'][] = ['todo', 'in-progress', 'done'];

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await axios.get<Task[]>(API_URL);
                setTasks(res.data)
            } catch (error) {
                console.error("Fatching Task error", error);
            }
        };
        fetchTasks();

        socket.on('taskUpdated', (updatedTask: Task) => {
            console.log("Real Time Update Ayga", updatedTask);
            setTasks((prev) => {
                const exists = prev.find(t => t._id === updatedTask._id);
                if (exists) {
                    return prev.map(t => t._id === updatedTask._id ? updatedTask : t);
                }
                return [...prev, updatedTask]
            });
        });
        return () => {
            socket.off('taskUpdated')
        }
    }, []);
    const handleAdd = async () => {
        if (!newTask) return;
        try {
            const res = await axios.post<Task>(API_URL, {
                title: newTask,
                status: 'todo',
                index: tasks.length
            });
            setTasks([...tasks, res.data]);
            setNewTask("");
        } catch (error) {
            console.error('error adding task', error);
        }
    };
    const handleDelete = async(id: string)=> {
    if (!window.confirm("confir delete")) return;
    try {
        await axios.delete((`${API_URL}/${id}`));
        setTasks(tasks.filter(t => t._id !==id));
    } catch (error) {
        console.error({ message: error });
    };
};

const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    const updatedTask = Array.from(tasks);
    const taskIndex = updatedTask.findIndex(t => t._id === draggableId);
    if (taskIndex !== -1) {
        updatedTask[taskIndex].status = destination.droppableId as Task['status'];
        setTasks(updatedTask)
    }
    await axios.patch(`${API_URL}/${draggableId}`, {
        status: destination.droppableId,
        index: destination.index
    });
};
return (
    <div style={{ padding: '40px', fontFamily: 'Arial', backgroundColor: 'MenuText', backgroundSize: 'cover', }}>
        <h2 style={{ textAlign: 'center', fontSize: '35px', color: 'wheat' }}> Shiv Kanban Board</h2>
        <div style={{ marginBlock: '30px', textAlign: 'center', margin: '0 0 80px 0' }}>
            <input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="NewTask....."
                style={{ padding: '10px', width: '200px', borderRadius: '40px', border: '1px solid #ddd' }}
            />
            <button onClick={handleAdd} style={{ padding: '10px 20px', cursor: 'pointer', marginLeft: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
                ADD TASK
            </button>

        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <DragDropContext onDragEnd={onDragEnd}>
                {columns.map((col) => (
                    <Droppable droppableId={col} key={col}>
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} style={{ background: '#ebacf', padding: '10px', width: '300px', borderRadius: '20px', minHeight: '500px', border: '2px solid rgba(223, 236, 211, 0.47)' }}>
                                <h3 style={{ textAlign: "center", color: '#444' }}>{col.toUpperCase()}</h3>
                                {tasks.filter(t => t.status === col).map((task, index) => (
                                    <Draggable key={task._id} draggableId={task._id} index={index}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{ userSelect: 'none', padding: '14px', margin: '0 0 8px 0', backgroundColor: 'white', borderRadius: '2px', boxShadow: '0 2px 4px(rgb0,0,0,0.1)', ...provided.draggableProps.style }}>
                                                {task.title}
                                                <button onClick={()=>handleDelete(task._id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>Delete</button>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </DragDropContext>
        </div>
    </div>
);

};

export default App;