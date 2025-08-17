<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Category;
use App\Models\Task;
use Inertia\Inertia;

class TaskManagerController extends Controller
{
    public function main()
    {
        return Inertia::render('Task/Main');
    }

    public function getPending()
    {
        $user = Auth::id();

        $pendingTasks = Task::where('user_id', auth()->id())
            ->where('status', 'pending')
            ->latest()
            ->get();

        return response()->json([
            'pendingTasks' => $pendingTasks
        ]);
    }

    public function getInProgress()
    {
        $inProgress = Task::where('user_id', auth()->id())
            ->where('status', 'in-progress')
            ->latest()
            ->get();
        
        return response()->json([
            'inProgress' => $inProgress
        ]);
    }

    public function getCompleted()
    {
        $completed = Task::where('user_id', auth()->id())
            ->where('status', 'completed')
            ->latest()
            ->get();

        return response()->json([
            'completed' => $completed,
        ]);
    }

    public function updatePending($id)
    {
        $task = Task::FindOrFail($id);

        $task->update([
            'status' => 'in-progress'
        ]);

        return back()->with('success', 'task updated successfully.');
    }

}
