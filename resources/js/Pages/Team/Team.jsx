import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link } from "@inertiajs/react";
import axios from "axios";

export default function Team() {
    const [teams, setTeam] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [name, setName] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await axios.get("/fetch");
                console.log("fetched team.", res.data.team);
                setTeam(res.data.team);
            } catch (error) {
                console.error("Something went wrong.", error);
            }
        };
        fetchTeam();
        const interval = setInterval(fetchTeam, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            const res = await axios.post("/team", {
                name,
            });
            console.log("Team created:", res.data);

            setName("");

            setShowCreateForm(false);
        } catch (error) {
            alert("Team created successfully!");
            console.error("Error creating team", error);
        }
    };
    return (
        <AuthenticatedLayout>
            <div>
                <h1>Teams</h1>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg"
                >
                    {showCreateForm ? "Close" : "Create Team"}
                </button>

                {showCreateForm && (
                    <div className="bg-gray-100 p-4 rounded-lg mb-4">
                        <h2 className="font-bold mb-2">New Team</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Team name"
                                className="border p-2 w-full mb-2"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Create Team
                            </button>
                        </form>
                    </div>
                )}
                {teams.length > 0 ? (
                    teams.map((team) => (
                        <div key={team.id}>
                            <Link href={`/team/${team.id}/show`}>
                                {team.name}
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No teams!</p>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
