import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        due_date: '',
        status: 'On Process'
    });
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, [currentPage, searchTerm]);

    const fetchTasks = () => {
        axios.get(`http://localhost:8000/tasks/`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            setTasks(response.data.results);
            setTotalPages(Math.ceil(response.data.count / 10)); // Adjust based on page size
        })
        .catch(error => {
            console.error('There was an error fetching the tasks!', error);
        });
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to first page on new search
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleNewTaskChange = (event) => {
        const { name, value } = event.target;
        setNewTask(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddTask = () => {
        axios.post('http://localhost:8000/task/', newTask, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            setTasks([...tasks, response.data]);
            setNewTask({
                title: '',
                description: '',
                due_date: '',
                status: 'On Process'
            });
        })
        .catch(error => {
            console.error('There was an error adding the task!', error);
        });
    };

    const handleEditTask = (id, updatedTask) => {
        axios.put(`http://localhost:8000/task/${id}/`, updatedTask, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            setTasks(tasks.map(task => (task.id === id ? response.data : task)));
            setEditingTask(null);
        })
        .catch(error => {
            console.error('There was an error updating the task!', error);
        });
    };

    const handleDeleteTask = (id) => {
        axios.delete(`http://localhost:8000/task/${id}/`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(() => {
            setTasks(tasks.filter(task => task.id !== id));
        })
        .catch(error => {
            console.error('There was an error deleting the task!', error);
        });
    };

    const handleToggleComplete = (id) => {
        const task = tasks.find(task => task.id === id);
        const updatedTask = { ...task, status: task.status === 'complete' ? 'On Process' : 'complete' };
        handleEditTask(id, updatedTask);
    };

    const startEditing = (task) => {
        setEditingTask(task);
        setNewTask(task);
    };

    const cancelEditing = () => {
        setEditingTask(null);
        setNewTask({
            title: '',
            description: '',
            due_date: '',
            status: 'On Process'
        });
    };

    return (
        <div>
            <h1>Task List</h1>
            <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={handleSearch}
            />
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        {task.title} - {task.status}
                        <button onClick={() => handleToggleComplete(task.id)}>
                            {task.status === 'complete' ? 'Mark Incomplete' : 'Mark Complete'}
                        </button>
                        <button onClick={() => startEditing(task)}>Edit</button>
                        <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <div>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        disabled={currentPage === index + 1}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            <div>
                <h2>{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={newTask.title}
                    onChange={handleNewTaskChange}
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={newTask.description}
                    onChange={handleNewTaskChange}
                />
                <input
                    type="date"
                    name="due_date"
                    value={newTask.due_date}
                    onChange={handleNewTaskChange}
                />
                <input
                    type="text"
                    name="status"
                    placeholder="Status"
                    value={newTask.status}
                    onChange={handleNewTaskChange}
                />
                <button onClick={editingTask ? () => handleEditTask(editingTask.id, newTask) : handleAddTask}>
                    {editingTask ? 'Update Task' : 'Add Task'}
                </button>
                {editingTask && <button onClick={cancelEditing}>Cancel</button>}
            </div>
        </div>
    );
};

export default TaskList;
