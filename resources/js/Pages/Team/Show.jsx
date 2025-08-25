import React, { useState, useEffect } from "react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Show({ teamId, teamName }) {
    const [owner, setOwner] = useState(null);
    const [members, setMembers] = useState([]);
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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

    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearch(value);

        if (value.length > 1) {
            const res = await axios.get(`/users/search?query=${value}`);
            setSuggestions(res.data);
        } else {
            setSuggestions([]);
        }
    };

    const handleAddMember = async (userId) => {
        setLoading(true);
        try {
            await axios.post(`/owner/team/${teamId}/add-member`, {
                user_id: userId,
            });
            setSearch("");
            setSuggestions([]);
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

                <div>
                    <input
                        type="text"
                        placeholder="Search user..."
                        value={search}
                        onChange={handleSearch}
                    />
                    {suggestions.length > 0 && (
                        <ul className="border rounded mt-2 bg-white">
                            {suggestions.map((user) => (
                                <li
                                    key={user.id}
                                    className="p-2 hover:bg-gray-200 cursor-pointer"
                                    onClick={() => handleAddMember(user.id)}
                                >
                                    {user.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
