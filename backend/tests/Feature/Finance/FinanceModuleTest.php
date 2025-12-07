<?php

declare(strict_types=1);

namespace Tests\Feature\Finance;

use App\Auth\KeycloakUser;
use App\Models\CashSession;
use App\Models\DailyClosure;
use App\Models\FixedCost;
use App\Models\Payment;
use App\Models\Producto;
use App\Models\Sale;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FinanceModuleTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutMiddleware([
            \App\Http\Middleware\KeycloakJwtMiddleware::class,
        ]);
    }

    public function test_create_fixed_cost(): void
    {
        $this->actingAsRole(['admin']);

        $response = $this->postJson('/api/finance/fixed-costs', [
            'name' => 'Alquiler',
            'monthly_amount' => 1000,
            'notes' => 'Local principal',
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('fixed_costs', [
            'name' => 'Alquiler',
            'monthly_amount' => 1000,
            'is_active' => true,
        ]);
    }

    public function test_update_fixed_cost(): void
    {
        $this->actingAsRole(['admin']);
        $cost = FixedCost::create([
            'name' => 'Internet',
            'monthly_amount' => 200,
            'is_active' => true,
            'created_by' => 'admin',
        ]);

        $response = $this->patchJson("/api/finance/fixed-costs/{$cost->id}", [
            'monthly_amount' => 250,
            'is_active' => false,
        ]);

        $response->assertOk();
        $this->assertDatabaseHas('fixed_costs', [
            'id' => $cost->id,
            'monthly_amount' => 250,
            'is_active' => false,
        ]);
    }

    public function test_calculate_daily_fixed_cost(): void
    {
        Carbon::setTestNow('2024-06-15');
        $this->actingAsRole(['admin']);

        FixedCost::create([
            'name' => 'Alquiler',
            'monthly_amount' => 1000,
            'is_active' => true,
            'created_by' => 'admin',
        ]);
        FixedCost::create([
            'name' => 'Servicios',
            'monthly_amount' => 500,
            'is_active' => true,
            'created_by' => 'admin',
        ]);
        FixedCost::create([
            'name' => 'Inactivo',
            'monthly_amount' => 300,
            'is_active' => false,
            'created_by' => 'admin',
        ]);

        $response = $this->getJson('/api/finance/fixed-costs/daily-total');

        $response->assertOk();
        $response->assertJson([
            'daily_cost' => 50.0,
            'total_monthly_costs' => 1500.0,
            'days_in_month' => 30,
        ]);
    }

    public function test_generate_daily_closure(): void
    {
        Carbon::setTestNow('2024-06-15');
        $this->actingAsRole(['admin']);

        $product = Producto::factory()->create();
        $cashSession = CashSession::factory()->create(['status' => 'OPEN']);
        $sale = Sale::create([
            'cash_session_id' => $cashSession->id,
            'user_id' => 'admin',
            'sale_number' => 'POS-1',
            'mode' => Sale::MODE_INTERNAL,
            'subtotal' => 200,
            'discount_total' => 0,
            'tax_total' => 0,
            'total' => 200,
            'status' => Sale::STATUS_COMPLETED,
            'printed_at' => null,
            'created_at' => Carbon::now(),
        ]);

        Payment::create([
            'sale_id' => $sale->id,
            'payment_method' => 'CASH',
            'amount' => 200,
        ]);

        FixedCost::create([
            'name' => 'Alquiler',
            'monthly_amount' => 300,
            'is_active' => true,
            'created_by' => 'admin',
        ]);

        $response = $this->postJson('/api/finance/daily-closures');

        $response->assertCreated();
        $response->assertJson([
            'total_sales' => 200.0,
            'total_fixed_costs' => 10.0,
            'gross_profit' => 190.0,
            'status' => DailyClosure::STATUS_CLOSED,
        ]);
    }

    public function test_prevent_duplicate_closure_for_same_date(): void
    {
        Carbon::setTestNow('2024-06-15');
        $this->actingAsRole(['admin']);

        $cashSession = CashSession::factory()->create(['status' => 'OPEN']);
        Sale::create([
            'cash_session_id' => $cashSession->id,
            'user_id' => 'admin',
            'sale_number' => 'POS-2',
            'mode' => Sale::MODE_INTERNAL,
            'subtotal' => 100,
            'discount_total' => 0,
            'tax_total' => 0,
            'total' => 100,
            'status' => Sale::STATUS_COMPLETED,
            'printed_at' => null,
            'created_at' => Carbon::now(),
        ]);

        FixedCost::create([
            'name' => 'Servicios',
            'monthly_amount' => 300,
            'is_active' => true,
            'created_by' => 'admin',
        ]);

        $this->postJson('/api/finance/daily-closures')->assertCreated();
        $response = $this->postJson('/api/finance/daily-closures');

        $response->assertStatus(422);
    }

    public function test_annul_closure(): void
    {
        Carbon::setTestNow('2024-06-15');
        $this->actingAsRole(['admin']);

        $cashSession = CashSession::factory()->create(['status' => 'OPEN']);
        Sale::create([
            'cash_session_id' => $cashSession->id,
            'user_id' => 'admin',
            'sale_number' => 'POS-3',
            'mode' => Sale::MODE_INTERNAL,
            'subtotal' => 100,
            'discount_total' => 0,
            'tax_total' => 0,
            'total' => 100,
            'status' => Sale::STATUS_COMPLETED,
            'printed_at' => null,
            'created_at' => Carbon::now(),
        ]);

        FixedCost::create([
            'name' => 'Servicios',
            'monthly_amount' => 300,
            'is_active' => true,
            'created_by' => 'admin',
        ]);

        $closureResponse = $this->postJson('/api/finance/daily-closures')->assertCreated();
        $closureId = $closureResponse->json('id');

        $this->actingAsRole(['superadmin']);
        $annulResponse = $this->postJson("/api/finance/daily-closures/{$closureId}/annul");

        $annulResponse->assertOk();
        $this->assertDatabaseHas('daily_closures', [
            'id' => $closureId,
            'status' => DailyClosure::STATUS_ANNULLED,
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
