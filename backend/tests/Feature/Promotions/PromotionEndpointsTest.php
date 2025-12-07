<?php

declare(strict_types=1);

namespace Tests\Feature\Promotions;

use App\Auth\KeycloakUser;
use App\Models\Promotion;
use App\Models\Producto;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PromotionEndpointsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutMiddleware([
            \App\Http\Middleware\KeycloakJwtMiddleware::class,
        ]);
    }

    public function test_admin_can_create_product_promotion(): void
    {
        $this->actingAsRole(['admin']);

        $product = Producto::factory()->create();

        $payload = [
            'name' => 'Promo test',
            'scope_type' => Promotion::SCOPE_PRODUCT,
            'scope_id' => $product->id,
            'discount_value' => 10,
            'valid_from' => now()->toDateTimeString(),
            'valid_until' => now()->addDay()->toDateTimeString(),
            'is_active' => true,
        ];

        $response = $this->postJson('/api/promotions', $payload);

        $response->assertCreated();
        $this->assertDatabaseHas('promotions', [
            'name' => 'Promo test',
            'scope_type' => Promotion::SCOPE_PRODUCT,
            'scope_id' => $product->id,
        ]);
    }

    public function test_can_toggle_activation_state(): void
    {
        $this->actingAsRole(['admin']);
        $promotion = Promotion::factory()->create(['is_active' => true]);

        $response = $this->postJson('/api/promotions/' . $promotion->id . '/toggle');

        $response->assertOk();
        $this->assertDatabaseHas('promotions', [
            'id' => $promotion->id,
            'is_active' => false,
        ]);
    }

    public function test_check_endpoint_returns_best_scope(): void
    {
        $this->actingAsRole(['cajero']);
        $product = Producto::factory()->create(['categoria' => 9]);

        Promotion::factory()->create([
            'name' => 'Global promo',
            'scope_type' => Promotion::SCOPE_GLOBAL,
            'priority' => 1,
        ]);

        Promotion::factory()->create([
            'name' => 'Category promo',
            'scope_type' => Promotion::SCOPE_CATEGORY,
            'scope_id' => 9,
            'priority' => 5,
        ]);

        Promotion::factory()->create([
            'name' => 'Product promo',
            'scope_type' => Promotion::SCOPE_PRODUCT,
            'scope_id' => $product->id,
            'priority' => 2,
        ]);

        $response = $this->postJson('/api/promotions/check', [
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $response->assertOk();
        $this->assertTrue($response->json('promotion_applicable'));
        $this->assertSame('Product promo', $response->json('promotion.name'));
    }

    public function test_check_endpoint_returns_reason_when_quantity_low(): void
    {
        $this->actingAsRole(['cajero']);
        $product = Producto::factory()->create();

        Promotion::factory()->create([
            'scope_type' => Promotion::SCOPE_PRODUCT,
            'scope_id' => $product->id,
            'min_quantity' => 5,
        ]);

        $response = $this->postJson('/api/promotions/check', [
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        $response->assertOk();
        $this->assertFalse($response->json('promotion_applicable'));
        $this->assertSame('La cantidad es menor a la mínima requerida.', $response->json('reason'));
    }

    public function test_only_superadmin_can_soft_delete(): void
    {
        $this->actingAsRole(['admin']);
        $promotion = Promotion::factory()->create();

        $this->deleteJson('/api/promotions/' . $promotion->id)->assertForbidden();

        $this->actingAsRole(['superadmin']);
        $this->deleteJson('/api/promotions/' . $promotion->id)->assertOk();
        $this->assertSoftDeleted('promotions', ['id' => $promotion->id]);
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
