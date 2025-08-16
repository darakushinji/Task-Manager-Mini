import React, { useState, useEffect } from "react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Main() {
    const [activeTab, setActiveTab] = useState("pending");
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [pendings, setPending] = useState([]);
    const [inProgress, setInProgress] = useState([]);
    const [completed, setCompleted] = useState([]);

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

            {showCreateForm && (
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                    <h2 className="font-bold mb-2">New Task</h2>
                    <form>
                        <input
                            type="text"
                            placeholder="Task title"
                            className="border p-2 w-full mb-2"
                        />
                    </form>
                </div>
            )}

            <div className="mt-4 space-y-6">
                {activeTab === "pending" && (
                    <div>
                        {pendings.length > 0 ? (
                            pendings.map((task) => (
                                <div key={task.id}>
                                    <p>{task.title}</p>
                                    <p>{task.description}</p>
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
                                </div>
                            ))
                        ) : (
                            <p>No completed tasks! </p>
                        )}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
