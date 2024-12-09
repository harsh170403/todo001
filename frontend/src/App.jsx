import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");

    const fetchTodos = async () => {
        const response = await axios.get('http://13.201.76.245todos');
        setTodos(response.data);
    };

    const addTodo = async () => {
        if (newTodo.trim()) {
            await axios.post('http://13.201.76.245:5000/todos', { title: newTodo });
            setNewTodo("");
            fetchTodos();
        }
    };

    const toggleTodo = async (id, completed) => {
        await axios.put(`http://13.201.76.245:5000/todos/${id}`, { completed: !completed });
        fetchTodos();
    };

    const deleteTodo = async (id) => {
        await axios.delete(`http://13.201.76.245:5000/todos/${id}`);
        fetchTodos();
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-200 via-purple-300 via-indigo-700 via-blue-600 via-green-700 via-yellow-600 via-orange-300 to-pink-700 flex flex-col items-center">
            <div className="bg-white shadow-md rounded-lg p-6 w-96 fixed top-4 z-10">
                <h1 className="text-2xl font-bold mb-4 text-center">Todo App</h1>
                <div className="mb-4 flex">
                    <input
                        type="text"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="Add a new task"
                        className="flex-grow border p-2 rounded-l-md"
                    />
                    <button
                        onClick={addTodo}
                        className="bg-blue-500 text-white px-4 py-2 rounded-r-md"
                    >
                        Add
                    </button>
                </div>
            </div>

            <div className="mt-28 w-96">
                <ul className="space-y-2">
                    {todos.map((todo) => (
                        <li
                            key={todo.id}
                            className="flex items-center justify-between bg-gray-50 p-2 rounded-md shadow-sm"
                        >
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => toggleTodo(todo.id, todo.completed)}
                                    className="mr-2"
                                />
                                <span
                                    className={`${
                                        todo.completed ? "line-through text-gray-500" : ""
                                    }`}
                                >
                                    {todo.title}
                                </span>
                            </div>
                            <button
                                onClick={() => deleteTodo(todo.id)}
                                className="bg-red-500 text-white px-2 py-1 rounded-md"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
