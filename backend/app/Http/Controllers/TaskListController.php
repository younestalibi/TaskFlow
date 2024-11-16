<?php

namespace App\Http\Controllers;

use App\Models\TaskList;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class TaskListController extends Controller
{

    public function index()
    {
        $user = JWTAuth::parseToken()->authenticate();
        $taskLists = $user->taskLists;
        return response()->json($taskLists);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);
        $user = JWTAuth::parseToken()->authenticate();
        $taskList = TaskList::create([
            'title' => $request->title,
            'description' => $request->description,
            'user_id' => $user->id,
        ]);

        return response()->json($taskList, 201);
    }

    public function show($id)
    {
        $taskList = TaskList::with(['tasks', 'sharedUsers'])->find($id);
        if (!$taskList) {
            return response()->json(['error' => 'Task list not found'], 404);
        }
        return response()->json($taskList);
    }

    public function update(Request $request,  $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);
        $taskList = TaskList::findOrFail($id);
        $taskList->update([
            'title' => $request->title,
            'description' => $request->description,
        ]);

        return response()->json($taskList);
    }

    public function destroy($id)
    {
        $taskList = TaskList::findOrFail($id);
        $taskList->delete();
        return response()->json(['message' => 'Task list deleted successfully']);
    }

    public function autocomplete(Request $request)
    {
        $data = User::select("name", 'id', 'email')
            ->where('name', 'LIKE', '%' . $request->get('query') . '%')
            ->get();
        return response()->json($data);
    }

    public function shareTaskList(Request $request, $taskListId)
    {
        $validator = $request->validate([
            'users' => 'required|array',
            'users.*.id' => 'required|integer|exists:users,id',
            'users.*.permission' => 'required|string|in:view,edit',
        ]);

        $taskList = TaskList::find($taskListId);

        if (!$taskList) {
            return response()->json(["error" => "Task list not found"], 404);
        }

        $taskList->shareWithUsers($validator['users']);
        return response()->json(["message" => "success"]);
    }

    public function getSharedTaskList()
    {
        $user = JWTAuth::parseToken()->authenticate();
        $sharedTaskLists = $user->sharedTaskLists;
        return response()->json($sharedTaskLists);
    }
}
