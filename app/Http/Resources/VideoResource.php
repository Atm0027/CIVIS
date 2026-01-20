<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VideoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title ?? null,
            'url' => $this->url ?? null,
            'category_id' => $this->category_id ?? null,
            'created_at' => optional($this->created_at)->toISOString(),
        ];
    }
}
