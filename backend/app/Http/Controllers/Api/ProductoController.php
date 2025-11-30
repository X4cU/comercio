<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class ProductoController extends Controller
{
    public function index(): JsonResponse
    {
        $productos = Producto::query()
            ->orderBy('nombre')
            ->get();

        return response()->json($productos);
    }

    public function show(int $id): JsonResponse
    {
        $producto = Producto::findOrFail($id);

        return response()->json($producto);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validateData($request);

        if ($request->hasFile('imagen')) {
            $data['imagen'] = $request->file('imagen')->store('productos', 'public');
        }

        $producto = Producto::create($data);

        return response()->json($producto, Response::HTTP_CREATED);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $producto = Producto::findOrFail($id);
        $data = $this->validateData($request, $producto->id);

        if ($request->hasFile('imagen')) {
            if ($producto->imagen) {
                Storage::disk('public')->delete($producto->imagen);
            }
            $data['imagen'] = $request->file('imagen')->store('productos', 'public');
        }

        $producto->update($data);

        return response()->json($producto);
    }

    public function toggleEstado(int $id): JsonResponse
    {
        $producto = Producto::findOrFail($id);
        $producto->estado = !$producto->estado;
        $producto->save();

        return response()->json($producto);
    }

    private function validateData(Request $request, ?int $productoId = null): array
    {
        return $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'categoria' => ['nullable', 'string', 'max:255'],
            'unidad_venta' => ['nullable', 'string', 'max:255'],
            'tipo' => ['nullable', 'string', 'max:255'],
            'sku' => [
                'required',
                'string',
                'max:255',
                Rule::unique('productos', 'sku')->ignore($productoId),
            ],
            'descripcion' => ['nullable', 'string'],
            'imagen' => ['nullable', 'image', 'max:5120'],
            'estado' => ['boolean'],
        ]);
    }
}
