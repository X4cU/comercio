<?php

declare(strict_types=1);

namespace App\Http\Requests\Offers;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOfferRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'discount_percentage' => ['sometimes', 'numeric', 'min:1', 'max:90'],
            'affected_quantity' => ['sometimes', 'numeric', 'min:0.001'],
            'valid_from' => ['sometimes', 'date'],
            'valid_until' => ['sometimes', 'date', 'after_or_equal:valid_from'],
            'notes' => ['nullable', 'string'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
