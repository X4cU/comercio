<?php

declare(strict_types=1);

namespace Tests\Feature\Purchasing;

use App\Auth\KeycloakUser;
use App\Models\ProductStockTarget;
use App\Models\Producto;
use App\Models\PurchaseSuggestion;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PurchaseSuggestionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutMiddleware([
            \App\Http\Middleware\KeycloakJwtMiddleware::class,
        ]);
    }

    public function test_generate_creates_items_for_needed_products(): void
    {
        $this->actingAsRole(['admin']);

        $product = Producto::factory()->create();
        ProductStockTarget::factory()->create([
            'product_id' => $product->id,
            'min_stock' => 2,
            'optimal_stock' => 10,
        ]);
        $product->lifecycleStat()->create([
            'avg_daily_sales' => 2,
            'total_purchased_units' => 0,
            'total_sold_units' => 0,
        ]);

        $response = $this->postJson('/api/purchasing/suggestions/generate', [
            'projected_sales_days' => 3,
        ]);

        $response->assertOk();

        $this->assertDatabaseCount('purchase_suggestion_items', 1);
    }

    public function test_products_with_enough_stock_are_not_included(): void
    {
        $this->actingAsRole(['admin']);

        $product = Producto::factory()->create();
        ProductStockTarget::factory()->create([
            'product_id' => $product->id,
            'optimal_stock' => 5,
        ]);
        $product->lifecycleStat()->create([
            'avg_daily_sales' => 1,
            'total_purchased_units' => 20,
            'total_sold_units' => 1,
        ]);

        $response = $this->postJson('/api/purchasing/suggestions/generate');

        $response->assertOk();
        $this->assertDatabaseCount('purchase_suggestion_items', 0);
    }

    public function test_liquidation_history_reduces_recommendation(): void
    {
        $this->actingAsRole(['admin']);

        $product = Producto::factory()->create();
        ProductStockTarget::factory()->create([
            'product_id' => $product->id,
            'optimal_stock' => 10,
        ]);
        $product->lifecycleStat()->create([
            'avg_daily_sales' => 2,
            'liquidation_count' => 5,
            'total_purchased_units' => 0,
            'total_sold_units' => 0,
        ]);

        $response = $this->postJson('/api/purchasing/suggestions/generate');

        $response->assertOk();

        $item = PurchaseSuggestion::first()->items()->first();
        $this->assertTrue($item->recommended_qty < 10);
    }

    public function test_can_confirm_and_cancel_suggestion(): void
    {
        $this->actingAsRole(['admin']);

        $suggestion = PurchaseSuggestion::factory()->create();

        $this->postJson("/api/purchasing/suggestions/{$suggestion->id}/confirm")
            ->assertOk()
            ->assertJsonFragment(['status' => PurchaseSuggestion::STATUS_CONFIRMED]);

        $draft = PurchaseSuggestion::factory()->create();

        $this->postJson("/api/purchasing/suggestions/{$draft->id}/cancel")
            ->assertOk()
            ->assertJsonFragment(['status' => PurchaseSuggestion::STATUS_CANCELED]);
    }

    private function actingAsRole(array $roles): KeycloakUser
    {
        $user = new KeycloakUser([
            'sub' => 'test-user',
            'email' => 'test@example.com',
            'preferred_username' => 'tester',
            'realm_access' => ['roles' => $roles],
        ]);

        $this->be($user);

        return $user;
    }
}
