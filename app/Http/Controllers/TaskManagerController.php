<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Task;
use Inertia\Inertia;

class TaskManagerController extends Controller
{
    public function main()
    {
        return Inertia::render('Task/Main');
    }
}
