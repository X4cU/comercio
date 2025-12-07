<?php

declare(strict_types=1);

namespace App\Http\Requests\Promotions;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CheckPromotionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => ['required', 'integer', Rule::exists('productos', 'id')],
            'quantity' => ['required', 'numeric', 'gt:0'],
            'datetime' => ['nullable', 'date'],
        ];
    }
}
