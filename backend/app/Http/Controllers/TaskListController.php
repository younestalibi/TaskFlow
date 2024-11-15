<?php

namespace App\Http\Controllers;

use App\Models\TaskList;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class TaskListController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = JWTAuth::parseToken()->authenticate();
        $taskLists = $user->taskLists;
        return response()->json($taskLists);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
        $user = JWTAuth::parseToken()->authenticate();
        $taskList = TaskList::create([
            'title' => $request->title,
            'description' => $request->description,
            'user_id' => $user->id,
        ]);

        return response()->json($taskList, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $taskList = TaskList::findOrFail($id);
        return response()->json($taskList);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,  $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
        $taskList = TaskList::findOrFail($id);
        $taskList->update([
            'title' => $request->title,
            'description' => $request->description,
        ]);

        return response()->json($taskList);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $taskList = TaskList::findOrFail($id);
        $taskList->delete();
        return response()->json(['message' => 'Task list deleted successfully']);
    }
}
