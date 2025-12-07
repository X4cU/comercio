<?php

declare(strict_types=1);

namespace App\Http\Requests\Promotions;

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
            'scope_type' => ['required', Rule::in(['GLOBAL', 'CATEGORY', 'PRODUCT'])],
            'scope_id' => ['nullable', 'integer', 'required_if:scope_type,CATEGORY,PRODUCT'],
            'discount_value' => ['required', 'numeric', 'gt:0', 'lte:100'],
            'min_quantity' => ['nullable', 'numeric', 'gt:0'],
            'valid_from' => ['required', 'date'],
            'valid_until' => ['nullable', 'date', 'after:valid_from'],
            'is_active' => ['boolean'],
            'priority' => ['nullable', 'integer', 'min:1'],
        ];
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
