<?php

declare(strict_types=1);

namespace App\Http\Requests\Inventory;

use Illuminate\Foundation\Http\FormRequest;

class CreateNewMerchandiseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => 'required|integer|exists:productos,id',
            'arrival_date' => 'required|date',
            'expiration_date' => 'nullable|date',
            'gross_cost_per_bulk' => 'required|numeric|min:0',
            'bulk_units' => 'required|numeric|min:0.001',
            'initial_shrinkage_rate' => 'nullable|numeric|min:0',
            'margin_rate' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ];
    }
}
