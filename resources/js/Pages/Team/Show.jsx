import React, { useState, useEffect } from "react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Show({ teamId, teamName }) {
    const [owner, setOwner] = useState(null);
    const [members, setMembers] = useState([]);
    const [newMemberId, setNewMemberId] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const res = await axios.get(`/team/${teamId}/members`);
                console.log("Owner: ", res.data.owner);
                setOwner(res.data.owner);
                setMembers(res.data.members);
            } catch (error) {
                console.error("Error fetching members.", error);
            }
        };

        fetchMembers();
        const interval = setInterval(fetchMembers, 1000);
        return () => clearInterval(interval);
    }, [teamId]);

    const handleAddMember = async (e) => {
        e.preventDefault();
        if (!newMemberId) return alert("Please enter a user ID.");

        setLoading(true);
        try {
            await axios.post(`/owner/team/${teamId}/add-member`, {
                user_id: newMemberId,
            });
            setNewMemberId("");
        } catch (error) {
            console.error("Error adding member", error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <AuthenticatedLayout>
            <div className="p-4">
                <h1 className="text-2xl font-bold">{teamName}</h1>
                {owner && <p className="mt-2">Owner: {owner.name}</p>}

                <h2 className="mt-4 font-semibold">Members:</h2>
                <ul className="list-disc ml-6">
                    {members.length > 0 ? (
                        members.map((member) => (
                            <li key={member.id}>
                                {member.name}
                                {owner && member.id === owner.id && (
                                    <span className="text-gray-500 text-sm">
                                        - owner
                                    </span>
                                )}
                            </li>
                        ))
                    ) : (
                        <li>No members found.</li>
                    )}
                </ul>

                <div classNamme="mt-6 border-t pt-4">
                    <h3>Add Member</h3>
                    <form onSubmit={handleAddMember} className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Enter user ID"
                            value={newMemberId}
                            onChange={(e) => setNewMemberId(e.target.value)}
                            className="border rounded px-3 py-2 w-48"
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            disabled={loading}
                        >
                            {loading ? "Adding..." : "Add"}
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
