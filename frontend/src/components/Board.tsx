import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { io, Socket } from "socket.io-client";
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { useAuth } from "../Context/authContext";

const BASE_URL = "https://karban-board-1.onrender.com";
const socket: Socket = io(BASE_URL, {
    transports: ['websocket'],
    upgrade: false
});


interface Task {
    _id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in-progress' | 'done';
    priority: 'high' | 'medium' | 'low';
    index: number;
}

const Board: React.FC = () => {
    const { logout } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState<string>("");
    const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const columns: Task['status'][] = ['todo', 'in-progress', 'done'];
    const { token, loading: authLoading } = useAuth();

    useEffect(() => {
        
        const fetchTasks = async () => {

            try {
                const currentToken = token || localStorage.getItem('token');

                if (!currentToken) {
                    console.error("No authentication token found. Please log in.");
                    setLoading(false);
                    return;
                }
                const res = await api.get('/tasks', {
                    headers: {
                        'x-auth-token': currentToken
                    }

                });

                setTasks(res.data);
            } catch (error) {
                console.error("Fetching Task error", error);
            } finally {
                setLoading(false);
            }
        };
        if (!authLoading) {
        fetchTasks();
    }
      
      

        socket.on('taskUpdated', (updatedTask: Task) => {
            setTasks((prev) => {
                const exists = prev.find(t => t._id === updatedTask._id);
                if (exists) {
                    return prev.map(t => t._id === updatedTask._id ? updatedTask : t);
                }
                return [...prev, updatedTask];
            });
        });
        return () => { socket.off('taskUpdated'); };
    }, [token, authLoading]);

    const handleAdd = async () => {
        if (!newTask) return;
        try {

            const token = localStorage.getItem('token')
            const res = await api.post<Task>('/tasks', {

                title: newTask,
                status: 'todo',
                priority: priority,
                index: tasks.length
            },
                {
                    headers: { 'x-auth-token': token }


                });
            setTasks((prev) => [...prev, res.data]);
            setNewTask("")
            console.log("Task add", res.data);
        } catch (error) {
            console.error('error adding task', error);
        }
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm("Bhai, pakka delete karna hai?")) return;
        try {
            const token = localStorage.getItem('token'); { }
            await api.delete(`/tasks/${id}`, {
                headers: { 'x-auth-token': token }
            })

            setTasks(tasks.filter(t => t._id !== id));
        } catch (error) {
            console.error("Delete Error", error);
        }
    };

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const updatedTasks = Array.from(tasks);
        const taskIndex = updatedTasks.findIndex(t => t._id === draggableId);

        if (taskIndex !== -1) {
            updatedTasks[taskIndex].status = destination.droppableId as Task['status'];
            setTasks(updatedTasks);
        }

        try {
            const token = localStorage.getItem('token');
            await api.patch(`/tasks/${draggableId}`, {
                status: destination.droppableId,
                index: destination.index
            },

                {
                    headers: { 'x-auth-token': token }
                });
        } catch (error) {
            console.error("Patch error", error);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1a1a1a', color: 'wheat' }}>
                <h2>Date arha ah</h2>
            </div>
        );
    }

    return (
        <div style={{ padding: '40px', minHeight: '100vh', backgroundColor: '#1a1a1a', color: 'wheat' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '38px', marginLeft: '520px' }}>Shiv Kanban Board</h2>
                <button onClick={logout} style={{ padding: '8px 16px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Logout
                </button>
            </div>

            <div style={{ margin: '30px 0', textAlign: 'center' }}>
                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="text"
                        placeholder="🔍 Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '10px 15px', width: '300px', borderRadius: '20px', border: '1px solid #555', backgroundColor: '#2a2a2a', color: 'wheat', outline: 'none' }}
                    />
                </div>

                <input
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Task Title"
                    style={{ padding: '10px', width: '250px', borderRadius: '20px', border: '1px solid #ddd', color: '#333' }}
                />

                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    style={{ padding: '10px', borderRadius: '20px', marginLeft: '10px', backgroundColor: '#2a2a2a', color: 'wheat', border: '1px solid #ddd' }}
                >
                    <option value="high">🔴 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                </select>

                <button onClick={handleAdd} style={{ padding: '10px 20px', cursor: 'pointer', marginLeft: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
                    ADD TASK
                </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-around', gap: '20px' }}>
                <DragDropContext onDragEnd={onDragEnd}>
                    {columns.map((col) => (
                        <Droppable droppableId={col} key={col}>
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', width: '300px', borderRadius: '15px', minHeight: '500px', border: '1px solid rgba(255,255,255,0.2)' }}>
                                    <h3 style={{ textAlign: "center", color: 'wheat' }}>{col.toUpperCase()}</h3>
                                    {tasks
                                        .filter(t => t.status === col)
                                        .filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map((task, index) => (
                                            <Draggable key={task._id} draggableId={task._id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                            borderLeft: `6px solid ${task.priority === 'high' ? '#ff4444' : task.priority === 'medium' ? '#ffbb33' : '#00c851'}`,
                                                            backgroundColor: 'white',
                                                            color: '#333',
                                                            padding: '16px',
                                                            margin: '0 0 12px 0',
                                                            borderRadius: '8px',
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                                        }}
                                                    >
                                                        <span style={{ fontWeight: '500' }}>{task.title}</span>
                                                        <button onClick={() => handleDelete(task._id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px' }}>×</button>
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

export default Board;