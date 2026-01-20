<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    protected $fillable = ['title','description','url','duration','category_id','published'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
