<?php

declare(strict_types=1);

namespace App\Http\Requests\Inventory;

use Illuminate\Foundation\Http\FormRequest;

class CreatePricingRuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'scope_type' => 'required|string|in:GLOBAL,SECTION,CATEGORY,PRODUCT',
            'scope_id' => 'nullable|integer',
            'default_margin_rate' => 'required|numeric|min:0',
            'default_shrinkage_rate' => 'required|numeric|min:0',
            'enabled' => 'required|boolean',
        ];
    }
}
