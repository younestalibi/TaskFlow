<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // public function index()
    // {
    //     $user = JWTAuth::parseToken()->authenticate();
    //     $taskLists = $user->taskLists()->with('tasks')->get(); 
    //     return response()->json($taskLists);
    // }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'task_list_id' => 'required|exists:task_lists,id',
        ]);

        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'task_list_id' => $request->task_list_id,
        ]);

        return response()->json($task, 201);
    }

    /**
     * Display the specified resource.
     */
    // public function show(Task $task)
    // {
    //     return response()->json($task);
    // }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $task->update([
            'title' => $request->title,
            'description' => $request->description,
        ]);

        return response()->json($task);
    }
    public function updateStatus(Request $request, Task $task)
    {
        $request->validate([
            'status' => 'required|in:todo,doing,done',
        ]);

        $task->update([
            'status' => $request->status,
        ]);

        return response()->json($task);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(['message' => 'Task deleted successfully']);
    }
}
