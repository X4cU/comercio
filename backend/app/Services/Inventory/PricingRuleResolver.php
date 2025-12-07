<?php

declare(strict_types=1);

namespace App\Services\Inventory;

use App\Models\Producto;
use App\Models\ProductPricingRule;

class PricingRuleResolver
{
    public function resolveForProduct(Producto $product): array
    {
        $candidates = ProductPricingRule::query()
            ->where('enabled', true)
            ->orderByRaw("FIELD(scope_type, 'PRODUCT','CATEGORY','SECTION','GLOBAL')")
            ->get();

        $category = $product->categoria;
        foreach ($candidates as $rule) {
            if ($rule->scope_type === 'PRODUCT' && (int) $rule->scope_id === (int) $product->id) {
                return $this->format($rule);
            }
            if ($rule->scope_type === 'CATEGORY' && $rule->scope_id && $category && (int) $rule->scope_id === (int) $category) {
                return $this->format($rule);
            }
            if ($rule->scope_type === 'SECTION' && $rule->scope_id && $product->section === $rule->scope_id) {
                return $this->format($rule);
            }
            if ($rule->scope_type === 'GLOBAL') {
                return $this->format($rule);
            }
        }

        return [
            'margin' => 0.0,
            'shrinkage' => 0.0,
        ];
    }

    private function format(ProductPricingRule $rule): array
    {
        return [
            'margin' => (float) $rule->default_margin_rate,
            'shrinkage' => (float) $rule->default_shrinkage_rate,
        ];
    }
}
