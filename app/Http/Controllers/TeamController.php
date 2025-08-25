<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Team;
use Inertia\Inertia;

class TeamController extends Controller
{
    public function main()
    {
        return Inertia::render('Team/Team');
    }

    public function fetchTeam()
    {
        $team = Team::where('owner_id', auth()->id())
            ->latest()
            ->get();

        return response()->json([
            'team' => $team
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $team = Team::create([
            'name' => $request->name,
            'owner_id' => auth()->id(),
        ]);

        // add owner as team member
        $team->users()->attach(auth()->id(), ['role' => 'owner']);

        return response()->json([
            'success' => true,
            'team' => $team
        ]);
    }

    public function showTeam($id)
    {   
        $team = Team::where('owner_id', auth()->id())->findOrFail($id);
        
        return Inertia::render('Team/Show', [
            'teamId' => $team->id,
            'teamName' => $team->name,
        ]);
    }

    public function fetchMembers($id)
    {   
        $team = Team::with(['users', 'owner'])
            ->where('id', $id)
            ->where('owner_id', auth()->id())
            ->firstOrFail();
        
        return response()->json([
            'owner' => $team->owner,
            'members' => $team->users,
        ]);
    }

    public function addMember(Request $request, $id)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $team = Team::where('owner_id', auth()->id())->findOrFail($id);

        $team->users()->syncWithoutDetaching($request->user_id);

        $team->load('users', 'owner');

        return response()->json([
            'success' => true,
            'team' => $team,
        ]);
    }

    public function fetchAccounts()
    {
        $accounts = User::all()->get();

        return response()->json([
            'accounts' => $accounts,
        ]);
    }
}
