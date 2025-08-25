<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TaskManagerController;
use App\Http\Controllers\TeamController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/task', [TaskManagerController::class, 'main'])->name('task.main');
    Route::get('/team', [TeamController::class, 'main'])->name('team.main');
    Route::get('/team/{id}/show', [TeamController::class, 'showTeam'])->name('team.show');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// api routes
Route::middleware(['api.auth'])->group(function () {
    Route::post('/tasks', [TaskManagerController::class, 'store']);
    Route::put('/tasks/{id}/update', [TaskManagerController::class, 'editTask']);
    Route::get('/pending/tasks', [TaskManagerController::class, 'getPending']);
    Route::put('/task/{id}/update', [TaskManagerController::class, 'updatePending']);
    Route::put('/task/completed/{id}/update', [TaskManagerController::class, 'updateInprogress']);
    Route::get('/categories', [TaskManagerController::class, 'categories']);
    Route::get('/in-progress/tasks', [TaskManagerController::class, 'getInProgress']);
    Route::get('/completed/tasks', [TaskManagerController::class, 'getCompleted']);
    Route::get('/fetch', [TeamController::class, 'fetchTeam']);
    Route::post('/team', [TeamController::class, 'store']);
    Route::get('/team/{id}/members', [TeamController::class, 'fetchMembers']);
    Route::post('/owner/team/{id}/add-member', [TeamController::class, 'addMember']);
});


require __DIR__.'/auth.php';
