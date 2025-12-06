<?php

declare(strict_types=1);

namespace Tests\Feature\Offers;

use App\Auth\KeycloakUser;
use App\Models\ProductOffer;
use App\Models\Producto;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OfferEndpointsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutMiddleware([
            \App\Http\Middleware\KeycloakJwtMiddleware::class,
        ]);
    }

    public function test_suggestions_endpoint_returns_candidates(): void
    {
        $this->actingAsRole(['repositor']);

        $product = Producto::factory()->create([
            'shelf_life_days' => 2,
        ]);
        $product->lifecycleStat()->create([
            'last_purchase_date' => now()->subDay(),
            'estimated_shelf_life_days' => 2,
            'total_purchased_units' => 10,
            'total_sold_units' => 2,
        ]);

        $response = $this->getJson('/api/offers/suggestions');

        $response
            ->assertOk()
            ->assertJsonFragment([
                'product_id' => $product->id,
                'suggested_type' => ProductOffer::TYPE_CLEARANCE,
            ]);
    }

    public function test_admin_can_create_offer(): void
    {
        $this->actingAsRole(['admin']);

        $product = Producto::factory()->create([
            'shelf_life_days' => 4,
        ]);
        $product->lifecycleStat()->create([
            'last_purchase_date' => now()->subDays(2),
            'estimated_shelf_life_days' => 4,
            'total_purchased_units' => 50,
            'total_sold_units' => 10,
        ]);

        $payload = [
            'product_id' => $product->id,
            'type' => ProductOffer::TYPE_PROMO,
            'discount_percentage' => 20,
            'affected_quantity' => 5,
            'valid_from' => now()->toDateTimeString(),
            'valid_until' => now()->addDay()->toDateTimeString(),
            'notes' => 'Oferta de prueba',
            'old_price' => 120,
        ];

        $response = $this->postJson('/api/offers', $payload);

        $response->assertCreated();

        $this->assertDatabaseHas('product_offers', [
            'product_id' => $product->id,
            'type' => ProductOffer::TYPE_PROMO,
            'discount_percentage' => 20,
            'new_price' => 96.00,
        ]);
    }

    public function test_cannot_create_offer_with_invalid_discount(): void
    {
        $this->actingAsRole(['admin']);

        $product = Producto::factory()->create();

        $response = $this->postJson('/api/offers', [
            'product_id' => $product->id,
            'type' => ProductOffer::TYPE_PROMO,
            'discount_percentage' => 95,
            'affected_quantity' => 2,
            'valid_from' => now()->toDateTimeString(),
            'valid_until' => now()->addDay()->toDateTimeString(),
        ]);

        $response->assertUnprocessable();
    }

    public function test_cannot_apply_offer_when_quantity_exceeds_stock(): void
    {
        $this->actingAsRole(['admin']);

        $product = Producto::factory()->create();
        $product->lifecycleStat()->create([
            'last_purchase_date' => now()->subDay(),
            'estimated_shelf_life_days' => 5,
            'total_purchased_units' => 5,
            'total_sold_units' => 1,
        ]);

        $response = $this->postJson('/api/offers', [
            'product_id' => $product->id,
            'type' => ProductOffer::TYPE_PROMO,
            'discount_percentage' => 10,
            'affected_quantity' => 10,
            'valid_from' => now()->toDateTimeString(),
            'valid_until' => now()->addDay()->toDateTimeString(),
            'old_price' => 50,
        ]);

        $response->assertUnprocessable();
    }

    public function test_stats_endpoint_returns_ordered_results(): void
    {
        $this->actingAsRole(['admin']);

        $productA = Producto::factory()->create();
        $productB = Producto::factory()->create();

        ProductOffer::factory()->create([
            'product_id' => $productA->id,
            'type' => ProductOffer::TYPE_PROMO,
            'affected_quantity' => 5,
        ]);
        ProductOffer::factory()->create([
            'product_id' => $productA->id,
            'type' => ProductOffer::TYPE_CLEARANCE,
            'affected_quantity' => 3,
        ]);
        ProductOffer::factory()->create([
            'product_id' => $productB->id,
            'type' => ProductOffer::TYPE_PROMO,
            'affected_quantity' => 2,
        ]);

        $response = $this->getJson('/api/offers/stats/top?limit=2');

        $response->assertOk();
        $data = $response->json();

        $this->assertSame($productA->id, $data[0]['product_id']);
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
