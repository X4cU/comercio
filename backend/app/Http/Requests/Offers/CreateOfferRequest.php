<?php

declare(strict_types=1);

namespace App\Http\Requests\Offers;

use Illuminate\Foundation\Http\FormRequest;

class CreateOfferRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'product_id' => ['required', 'exists:productos,id'],
            'type' => ['required', 'in:PROMO,CLEARANCE'],
            'discount_percentage' => ['required', 'numeric', 'min:1', 'max:90'],
            'affected_quantity' => ['required', 'numeric', 'min:0.001'],
            'valid_from' => ['required', 'date'],
            'valid_until' => ['required', 'date', 'after_or_equal:valid_from'],
            'notes' => ['nullable', 'string'],
            'old_price' => ['sometimes', 'numeric', 'min:0'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
