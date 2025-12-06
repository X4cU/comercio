<?php

declare(strict_types=1);

namespace App\Http\Requests\Pos;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateSaleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cash_session_id' => ['required', 'integer', 'exists:cash_sessions,id'],
            'mode' => ['required', Rule::in(['INTERNAL', 'ARCA_STUB'])],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:productos,id'],
            'items.*.quantity' => ['required', 'numeric', 'gt:0'],
            'items.*.unit_price' => ['required', 'numeric', 'gt:0'],
            'items.*.discount_amount' => ['nullable', 'numeric', 'min:0'],
            'payments' => ['required', 'array', 'min:1'],
            'payments.*.payment_method' => ['required', Rule::in(['CASH', 'DEBIT_CARD', 'CREDIT_CARD', 'TRANSFER', 'OTHER'])],
            'payments.*.amount' => ['required', 'numeric', 'gt:0'],
            'payments.*.details' => ['nullable', 'array'],
            'global_discount_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ];
    }
}
