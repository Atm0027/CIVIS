<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Faq;

class FaqController extends Controller
{
    public function index(Request $request)
    {
        $query = Faq::query()->orderBy('id');

        if ($request->filled('q')) {
            $search = $request->query('q');
            $query->where(function ($q) use ($search) {
                $q->where('question', 'ilike', "%{$search}%")
                    ->orWhere('answer', 'ilike', "%{$search}%");
            });
        }

        return response()->json($query->get());
    }
}
