<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'task_list_id', 'title', 'description', 'status'
    ];

    public function taskList()
    {
        return $this->belongsTo(TaskList::class);
    }
}
