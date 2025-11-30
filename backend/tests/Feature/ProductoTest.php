<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Auth\KeycloakUser;
use App\Models\Producto;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductoTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutMiddleware([
            \App\Http\Middleware\KeycloakJwtMiddleware::class,
        ]);
    }

    public function test_superadmin_can_create_producto(): void
    {
        $this->actingAsRole(['superadmin']);

        $response = $this->postJson('/api/productos', [
            'nombre' => 'Yerba mate',
            'categoria' => 'Almacén',
            'unidad_venta' => 'unidad',
            'tipo' => 'infusión',
            'sku' => 'SKU-001',
            'descripcion' => 'Paquete de 1kg',
            'estado' => true,
        ]);

        $response->assertCreated();

        $this->assertDatabaseHas('productos', [
            'nombre' => 'Yerba mate',
            'sku' => 'SKU-001',
        ]);
    }

    public function test_superadmin_can_update_producto(): void
    {
        $this->actingAsRole(['superadmin']);

        $producto = Producto::factory()->create([
            'nombre' => 'Café',
            'sku' => 'SKU-CAF-01',
        ]);

        $response = $this->putJson("/api/productos/{$producto->id}", [
            'nombre' => 'Café tostado',
            'categoria' => 'Bebidas',
            'unidad_venta' => 'kg',
            'tipo' => 'tostado',
            'sku' => 'SKU-CAF-01',
            'descripcion' => 'Bolsa de 1kg',
            'estado' => false,
        ]);

        $response
            ->assertOk()
            ->assertJsonFragment([
                'nombre' => 'Café tostado',
                'estado' => false,
            ]);
    }

    public function test_non_superadmin_cannot_modify_producto(): void
    {
        $this->actingAsRole(['vendedor']);

        $producto = Producto::factory()->create([
            'sku' => 'SKU-ABC-1',
        ]);

        $this->postJson('/api/productos', [
            'nombre' => 'Té verde',
            'sku' => 'SKU-NEW-1',
        ])->assertForbidden();

        $this->putJson("/api/productos/{$producto->id}", [
            'nombre' => 'Té verde premium',
            'sku' => 'SKU-ABC-1',
        ])->assertForbidden();

        $this->patchJson("/api/productos/{$producto->id}/estado")
            ->assertForbidden();
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
