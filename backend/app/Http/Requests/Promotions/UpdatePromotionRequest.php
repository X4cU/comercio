<?php

declare(strict_types=1);

namespace App\Http\Requests\Promotions;

use App\Models\Promotion;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            'discount_type' => ['sometimes', Rule::in([Promotion::DISCOUNT_PERCENTAGE, Promotion::DISCOUNT_FIXED_PRICE])],
            'discount_value' => ['required_if:discount_type,' . Promotion::DISCOUNT_PERCENTAGE, 'nullable', 'numeric', 'gte:0', 'lte:100'],
            'promotional_price' => ['required_if:discount_type,' . Promotion::DISCOUNT_FIXED_PRICE, 'nullable', 'numeric', 'gt:0'],
            'min_quantity' => ['nullable', 'numeric', 'gt:0'],
            'valid_from' => ['sometimes', 'date'],
            'valid_until' => ['nullable', 'date', 'after_or_equal:valid_from'],
            'priority' => ['nullable', 'integer', 'min:1'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => $this->input('name', $this->input('nombre')),
            'description' => $this->input('description', $this->input('descripcion')),
            'discount_type' => $this->input('discount_type', $this->input('tipo')),
            'discount_value' => $this->input('discount_value', $this->input('valor_descuento')),
            'promotional_price' => $this->input('promotional_price', $this->input('precio_promocional')),
            'valid_from' => $this->input('valid_from', $this->input('fecha_inicio')),
            'valid_until' => $this->input('valid_until', $this->input('fecha_fin')),
            'is_active' => $this->input('is_active', $this->input('activo')),
        ]);
    }
}
