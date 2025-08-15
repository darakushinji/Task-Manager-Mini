import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Main() {
    const [activeTab, setActiveTab] = useState("pending");
    return (
        <AuthenticatedLayout>
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
            <div className="mt-4 space-y-6">
                {activeTab === "pending" && (
                    <div>
                        <h1>Pending Tasks</h1>
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
