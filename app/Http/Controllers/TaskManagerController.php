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
}
