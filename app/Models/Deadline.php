<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Deadline extends Model
{
    protected $fillable = ['title','description','start_date','end_date','category_id','source_url'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
