<?php

declare(strict_types=1);

namespace App\Http\Requests\Promotions;

use App\Models\Promotion;
use App\Models\Producto;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreatePromotionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'scope_type' => ['required', Rule::in([Promotion::SCOPE_GLOBAL, Promotion::SCOPE_CATEGORY, Promotion::SCOPE_PRODUCT])],
            'scope_id' => ['nullable', 'integer', 'required_if:scope_type,CATEGORY,PRODUCT'],
            'discount_type' => ['required', Rule::in([Promotion::DISCOUNT_PERCENTAGE, Promotion::DISCOUNT_FIXED_PRICE])],
            'discount_value' => ['required_if:discount_type,' . Promotion::DISCOUNT_PERCENTAGE, 'nullable', 'numeric', 'gte:0', 'lte:100'],
            'promotional_price' => ['required_if:discount_type,' . Promotion::DISCOUNT_FIXED_PRICE, 'nullable', 'numeric', 'gt:0'],
            'min_quantity' => ['nullable', 'numeric', 'gt:0'],
            'valid_from' => ['nullable', 'date'],
            'valid_until' => ['nullable', 'date', 'after_or_equal:valid_from'],
            'is_active' => ['boolean'],
            'priority' => ['nullable', 'integer', 'min:1'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => $this->input('name', $this->input('nombre')),
            'description' => $this->input('description', $this->input('descripcion')),
            'discount_type' => $this->input('discount_type', $this->input('tipo', Promotion::DISCOUNT_PERCENTAGE)),
            'discount_value' => $this->input('discount_value', $this->input('valor_descuento')),
            'promotional_price' => $this->input('promotional_price', $this->input('precio_promocional')),
            'valid_from' => $this->input('valid_from', $this->input('fecha_inicio')),
            'valid_until' => $this->input('valid_until', $this->input('fecha_fin')),
            'is_active' => $this->input('is_active', $this->input('activo')),
        ]);
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator): void {
            $scopeType = $this->input('scope_type');
            $scopeId = (int) $this->input('scope_id');

            if ($scopeType === 'PRODUCT' && $scopeId) {
                $exists = Producto::query()->whereKey($scopeId)->exists();
                if (!$exists) {
                    $validator->errors()->add('scope_id', 'El producto seleccionado no existe.');
                }
            }

            if ($scopeType === 'CATEGORY' && $scopeId) {
                $exists = Producto::query()->where('categoria', $scopeId)->exists();
                if (!$exists) {
                    $validator->errors()->add('scope_id', 'La categoría seleccionada no existe.');
                }
            }
        });
    }
}
