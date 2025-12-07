<?php

declare(strict_types=1);

namespace Tests\Feature\Inventory;

use App\Auth\KeycloakUser;
use App\Models\ProductBatch;
use App\Models\ProductPricingRule;
use App\Models\Producto;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NewMerchandiseTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutMiddleware([
            \App\Http\Middleware\KeycloakJwtMiddleware::class,
        ]);
    }

    public function test_create_batch_for_produce_calculates_expiration_and_price(): void
    {
        $this->actingAsRole(['repositor']);

        $product = Producto::factory()->create([
            'section' => 'PRODUCE',
            'shelf_life_days' => 5,
        ]);

        ProductPricingRule::query()->create([
            'scope_type' => 'GLOBAL',
            'scope_id' => null,
            'default_margin_rate' => 30,
            'default_shrinkage_rate' => 10,
            'enabled' => true,
            'created_by' => 'tester',
        ]);

        $response = $this->postJson('/api/inventory/new-merchandise', [
            'product_id' => $product->id,
            'arrival_date' => '2025-01-01',
            'gross_cost_per_bulk' => 100,
            'bulk_units' => 10,
        ]);

        $response->assertCreated();

        $batch = ProductBatch::query()->first();
        $this->assertNotNull($batch);
        $this->assertEquals('2025-01-06', $batch->expiration_date?->format('Y-m-d'));
        $this->assertEquals(10 * 0.9, $batch->quantity_received);
        $this->assertEqualsWithDelta(14.29, $batch->base_price, 0.1);
        $this->assertEqualsWithDelta(18.57, $batch->final_price, 0.1);
    }

    public function test_create_batch_for_grocery_uses_manual_expiration(): void
    {
        $this->actingAsRole(['admin']);

        $product = Producto::factory()->create([
            'section' => 'GROCERY',
            'shelf_life_days' => null,
        ]);

        $response = $this->postJson('/api/inventory/new-merchandise', [
            'product_id' => $product->id,
            'arrival_date' => '2025-01-10',
            'expiration_date' => '2025-02-10',
            'gross_cost_per_bulk' => 50,
            'bulk_units' => 5,
            'initial_shrinkage_rate' => 0,
            'margin_rate' => 20,
        ]);

        $response->assertCreated();

        $batch = ProductBatch::query()->first();
        $this->assertEquals('2025-02-10', $batch->expiration_date?->format('Y-m-d'));
    }

    private function actingAsRole(array $roles): KeycloakUser
    {
        $user = new KeycloakUser([
            'sub' => 'test-user',
            'preferred_username' => 'tester',
            'roles' => $roles,
        ]);

        $this->actingAs($user, 'api');

        return $user;
    }
}
