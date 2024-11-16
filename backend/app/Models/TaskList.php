<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskList extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'description'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sharedUsers()
    {
        return $this->belongsToMany(User::class)
            ->withPivot('permission')
            ->withTimestamps();
    }

    public function shareWithUsers(array $userPermissions)
    {
        $formattedPermissions = [];
        foreach ($userPermissions as $user) {
            $formattedPermissions[$user['id']] = ['permission' => $user['permission']];
        }
        $this->sharedUsers()->sync($formattedPermissions);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
