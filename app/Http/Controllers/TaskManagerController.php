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

        $pendingTasks = Task::with('category')
            ->where('user_id', auth()->id())
            ->where('status', 'pending')
            ->latest()
            ->get();

        return response()->json([
            'pendingTasks' => $pendingTasks
        ]);
    }

    public function getInProgress()
    {
        $inProgress = Task::with('category')
            ->where('user_id', auth()->id())
            ->where('status', 'in-progress')
            ->latest()
            ->get();
        
        return response()->json([
            'inProgress' => $inProgress
        ]);
    }

    public function getCompleted()
    {
        $completed = Task::with('category')
            ->where('user_id', auth()->id())
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

        return response()->json([
            'success' => true,
            'message' => 'Task updated successfully.',
            'task' => $task,
        ]);
    }

    public function updateInProgress($id)
    {
        $task = Task::findOrFail($id);

        $task->update([
            'status' => 'completed',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Task updated successfully.',
            'task' => $task,
        ]);
    }

    public function categories()
    {
        $categories = Category::all();

        return response()->json([
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable',
            'category_id' => 'required|exists:categories,id',
        ]);

        $task = Task::create([
            'user_id' => auth()->id(),
            'category_id' => $request->category_id,
            'title' => $request->title,
            'description' => $request->description,
            'status' => 'pending'
        ]);

        $task->load('category');

        return response()->json([
            'success' => 'task created successfully',
            'task' => $task
        ]);
    }
}
