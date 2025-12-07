<?php

declare(strict_types=1);

namespace App\Http\Requests\Promotions;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePromotionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'discount_value' => ['sometimes', 'numeric', 'gt:0', 'lte:100'],
            'min_quantity' => ['nullable', 'numeric', 'gt:0'],
            'valid_from' => ['sometimes', 'date'],
            'valid_until' => ['nullable', 'date', 'after:valid_from'],
            'priority' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
