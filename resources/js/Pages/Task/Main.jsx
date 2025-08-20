import React, { useState, useEffect } from "react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Main() {
    const [activeTab, setActiveTab] = useState("pending");
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [pendings, setPending] = useState([]);
    const [inProgress, setInProgress] = useState([]);
    const [completed, setCompleted] = useState([]);
    const [categories, setCategories] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [errors, setErrors] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newCategory, setNewCategory] = useState("");

    // for pending tasks
    useEffect(() => {
        const fetchPendingTasks = async () => {
            try {
                const res = await axios.get("/pending/tasks");
                console.log(res.data.pendingTasks);
                setPending(res.data.pendingTasks);
            } catch (error) {
                console.error("Error fetching pending tasks. ", error);
            }
        };
        fetchPendingTasks();
        const interval = setInterval(fetchPendingTasks, 1000);
        return () => clearInterval(interval);
    }, []);

    // for in-progress tasks
    useEffect(() => {
        const fetchingInProgress = async () => {
            try {
                const res = await axios.get("/in-progress/tasks");
                console.log(res.data.inProgress);
                setInProgress(res.data.inProgress);
            } catch (error) {
                console.error("Error fetching in-progress tasks, ", error);
            }
        };

        fetchingInProgress();
        const interval = setInterval(fetchingInProgress, 1000);
        return () => clearInterval(interval);
    }, []);

    // for completed tasks
    useEffect(() => {
        const fetchingCompleted = async () => {
            try {
                const res = await axios.get("/completed/tasks");
                setCompleted(res.data.completed);
            } catch (error) {
                console.error("Error fetching completed tasks, ", error);
            }
        };
        fetchingCompleted();
        const interval = setInterval(fetchingCompleted, 1000);
        return () => clearInterval(interval);
    }, []);

    // category
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get("/categories");
                console.log("Categories", res.data.categories);
                setCategories(res.data.categories);
            } catch (error) {
                console.error("Error fetching categories", error);
            }
        };
        fetchCategories();
        const interval = setInterval(fetchCategories, 1000);
        return () => clearInterval(interval);
    }, []);

    // handle update status
    const handleUpdateStatus = async (id) => {
        try {
            const res = await axios.put(`/task/${id}/update`);
            console.log(res.data);

            setPending((prev) => prev.filter((task) => task.id !== id));
            setInProgress((prev) => [...prev, res.data.task]);
        } catch (error) {
            console.error("Error updating task status", error);
        }
    };

    const handleUpdateCompleteStatus = async (id) => {
        try {
            const res = await axios.put(`/task/completed/${id}/update`);

            setInProgress((prev) => prev.filter((task) => task.id !== id));
            setCompleted((prev) => [...prev, res.data.task]);
        } catch (error) {
            console.error("Error updating task status", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            const res = await axios.post("/tasks", {
                title,
                description,
                category_id: selectedCategory,
            });
            console.log("Task created:", res.data);

            setTitle("");
            setDescription("");
            setSelectedCategory("");

            // Add new task to pending
            setPending((prev) => [...prev, res.data.task]);

            setShowCreateForm(false);
        } catch (error) {
            alert("Tangina mo wala pa rin.");
            console.error("Error creating task", error);
        }
    };

    const openModal = (taskId) => {
        setSelectedTask(taskId);
        setNewTitle("");
        setNewDescription("");
        setNewCategory("");
        setShowModal(true);
    };

    return (
        <AuthenticatedLayout>
            <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-6 mb-4 border-b">
                    {["pending", "in-progress", "completed"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-2 px-4 text-sm font-semibold border-b-2 ${
                                activeTab === tab
                                    ? "border-purple-600 text-purple-600"
                                    : "border-transparent text-gray-500 hover:text-purple-600"
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg"
                >
                    {showCreateForm ? "Close" : "Create Task"}
                </button>
            </div>

            <div className="mt-4 space-y-6">
                {activeTab === "pending" && (
                    <div>
                        {pendings.length > 0 ? (
                            pendings.map((task) => (
                                <div key={task.id}>
                                    <p>{task.title}</p>
                                    <p>{task.description}</p>
                                    <p>Category: {task.category?.name}</p>
                                    <button
                                        onClick={() =>
                                            handleUpdateStatus(task.id)
                                        }
                                        className="mt-2 bg-purple-600 text-white px-3 py-1 rounded"
                                    >
                                        Move to In-Progress
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No pending tasks! </p>
                        )}
                    </div>
                )}
                {activeTab === "in-progress" && (
                    <div>
                        {inProgress.length > 0 ? (
                            inProgress.map((task) => (
                                <div key={task.id}>
                                    <p>{task.title}</p>
                                    <p>{task.description}</p>
                                    <p>Category: {task.category?.name}</p>
                                    <button
                                        onClick={() =>
                                            handleUpdateCompleteStatus(task.id)
                                        }
                                        className="mt-2 bg-purple-600 text-white px-3 py-1 rounded"
                                    >
                                        Move to Completed
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No in-progress tasks</p>
                        )}
                    </div>
                )}
                {activeTab === "completed" && (
                    <div>
                        {completed.length > 0 ? (
                            completed.map((task) => (
                                <div key={task.id}>
                                    <p>{task.title}</p>
                                    <p>{task.description}</p>
                                    <p>Category: {task.category?.name}</p>
                                </div>
                            ))
                        ) : (
                            <p>No completed tasks! </p>
                        )}
                    </div>
                )}
            </div>

            {showCreateForm && (
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                    <h2 className="font-bold mb-2">New Task</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Task title"
                            className="border p-2 w-full mb-2"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <textarea
                            placeholder="Description"
                            className="border p-2 w-full mb-2"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <select
                            className="border p-2 w-full mb-2"
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                        >
                            <option value="">- - Select Category - -</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Create Task
                        </button>
                    </form>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-bold">Edit Task</h2>
                        <input />
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
