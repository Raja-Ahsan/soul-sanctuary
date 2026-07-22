<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageContent extends Model
{
    protected $fillable = [
        'page',
        'key',
        'value',
        'image_url',
        'label',
        'sort_order',
    ];
}
