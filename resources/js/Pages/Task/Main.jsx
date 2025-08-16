import React, { useState, useEffect } from "react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Main() {
    const [activeTab, setActiveTab] = useState("pending");
    const [showCreateForm, setShowCreateForm] = useState("false");
    const [pendings, setPending] = useState([]);

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
                        {pendings.map((pending) => (
                            <h1>{pending.title}</h1>
                        ))}
                    </div>
                )}
                {activeTab === "in-progress" && (
                    <div>
                        <h1>In-progress Tasks</h1>
                    </div>
                )}
                {activeTab === "completed" && (
                    <div>
                        <h1>Completed Tasks</h1>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
