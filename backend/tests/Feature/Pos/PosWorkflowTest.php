<?php

declare(strict_types=1);

namespace Tests\Feature\Pos;

use App\Auth\KeycloakUser;
use App\Models\CashRegister;
use App\Models\CashSession;
use App\Models\Producto;
use App\Models\Sale;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PosWorkflowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutMiddleware([
            \App\Http\Middleware\KeycloakJwtMiddleware::class,
        ]);
    }

    public function test_open_cash_session(): void
    {
        $this->actingAsRole(['cajero']);
        $cashRegister = CashRegister::factory()->create();

        $response = $this->postJson('/api/pos/cash-sessions/open', [
            'cash_register_id' => $cashRegister->id,
            'opening_amount' => 1500,
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('cash_sessions', [
            'cash_register_id' => $cashRegister->id,
            'status' => 'OPEN',
        ]);
    }

    public function test_create_simple_sale(): void
    {
        $this->actingAsRole(['cajero']);
        $cashSession = CashSession::factory()->create([
            'status' => 'OPEN',
            'closed_at' => null,
        ]);
        $product = Producto::factory()->create();

        $response = $this->postJson('/api/pos/sales', [
            'cash_session_id' => $cashSession->id,
            'mode' => 'INTERNAL',
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 2,
                    'unit_price' => 100,
                    'discount_amount' => 0,
                ],
            ],
            'payments' => [
                [
                    'payment_method' => 'CASH',
                    'amount' => 200,
                ],
            ],
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('sales', [
            'cash_session_id' => $cashSession->id,
            'status' => Sale::STATUS_COMPLETED,
        ]);
        $this->assertDatabaseCount('sale_items', 1);
        $this->assertDatabaseCount('payments', 1);
    }

    public function test_discount_limit_for_cashier(): void
    {
        $this->actingAsRole(['cajero']);
        $cashSession = CashSession::factory()->create([
            'status' => 'OPEN',
            'closed_at' => null,
        ]);
        $product = Producto::factory()->create();

        $response = $this->postJson('/api/pos/sales', [
            'cash_session_id' => $cashSession->id,
            'mode' => 'INTERNAL',
            'global_discount_percent' => 20,
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 1,
                    'unit_price' => 100,
                    'discount_amount' => 0,
                ],
            ],
            'payments' => [
                [
                    'payment_method' => 'CASH',
                    'amount' => 80,
                ],
            ],
        ]);

        $response->assertStatus(400);
    }

    public function test_close_cash_session(): void
    {
        $this->actingAsRole(['admin']);
        $cashSession = CashSession::factory()->create([
            'status' => 'OPEN',
            'closed_at' => null,
        ]);
        $product = Producto::factory()->create();

        $this->postJson('/api/pos/sales', [
            'cash_session_id' => $cashSession->id,
            'mode' => 'INTERNAL',
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 1,
                    'unit_price' => 100,
                ],
            ],
            'payments' => [
                [
                    'payment_method' => 'CASH',
                    'amount' => 100,
                ],
            ],
        ]);

        $response = $this->postJson('/api/pos/cash-sessions/close', [
            'cash_session_id' => $cashSession->id,
            'closing_amount' => 100,
        ]);

        $response->assertOk();
        $this->assertDatabaseHas('cash_sessions', [
            'id' => $cashSession->id,
            'status' => 'CLOSED',
        ]);
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
