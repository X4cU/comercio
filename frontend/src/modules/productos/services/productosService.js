import { stockService } from '../../stock/services/stockService';

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

let productos = [
  {
    id: 'prd-1',
    nombre: 'Café Tostado 500g',
    categoriaId: 'cat-1',
    subcategoriaId: 'sub-1',
    precioBase: 6.5,
    precioFinal: 7.8,
    stock: 45,
    unidad: 'paquete',
    descripcion: 'Café arábica tostado, aroma intenso para supermercado.',
    imagen:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    creadoEn: new Date().toISOString()
  },
  {
    id: 'prd-2',
    nombre: 'Leche Entera 1L',
    categoriaId: 'cat-2',
    subcategoriaId: 'sub-3',
    precioBase: 1.2,
    precioFinal: 1.5,
    stock: 80,
    unidad: 'unidad',
    descripcion: 'Leche pasteurizada entera, presentación de un litro.',
    imagen:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    creadoEn: new Date().toISOString()
  }
];

const normalizarNumero = (valor) => {
  if (valor === '' || valor === null || valor === undefined) return null;
  const parsed = Number(valor);
  return Number.isNaN(parsed) ? null : parsed;
};

export const productosService = {
  async getProductos() {
    await delay();
    return productos.map((producto) => ({
      ...producto,
      stock: stockService.getStock(producto.id, producto.stock ?? 0)
    }));
  },

  async getProductoById(id) {
    await delay();
    const encontrado = productos.find((item) => item.id === id);
    if (!encontrado) {
      throw new Error('Producto no encontrado');
    }
    return { ...encontrado, stock: stockService.getStock(encontrado.id, encontrado.stock ?? 0) };
  },

  async createProducto(data) {
    await delay();
    const precioBase = normalizarNumero(data.precioBase) ?? 0;
    const precioFinal = normalizarNumero(data.precioFinal) ?? Math.max(precioBase * 1.15, precioBase);

    const nuevo = {
      id: crypto.randomUUID(),
      nombre: data.nombre.trim(),
      categoriaId: data.categoriaId,
      subcategoriaId: data.subcategoriaId || '',
      precioBase,
      precioFinal,
      stock: normalizarNumero(data.stock) ?? 0,
      unidad: data.unidad || 'unidad',
      descripcion: data.descripcion?.trim() || '',
      imagen: data.imagen,
      creadoEn: new Date().toISOString()
    };

    productos = [nuevo, ...productos];
    stockService.setStock(nuevo.id, nuevo.stock);
    return { ...nuevo };
  },

  async updateProducto(id, data) {
    await delay();
    let actualizado = null;
    productos = productos.map((producto) => {
      if (producto.id !== id) return producto;
      const precioBase = normalizarNumero(data.precioBase ?? producto.precioBase);
      const precioFinal =
        normalizarNumero(data.precioFinal) ??
        (precioBase !== null ? Math.max(precioBase * 1.15, precioBase) : producto.precioFinal);

      actualizado = {
        ...producto,
        ...data,
        nombre: data.nombre?.trim() ?? producto.nombre,
        precioBase: precioBase ?? producto.precioBase,
        precioFinal,
        stock: normalizarNumero(data.stock ?? producto.stock) ?? producto.stock,
        unidad: data.unidad || producto.unidad,
        descripcion: data.descripcion?.trim() ?? producto.descripcion
      };
      return actualizado;
    });

    if (!actualizado) {
      throw new Error('Producto no encontrado');
    }

    stockService.setStock(id, actualizado.stock);
    return { ...actualizado };
  },

  async actualizarStock(productoId, cantidadNueva) {
    await delay();
    let actualizado = null;
    productos = productos.map((producto) => {
      if (producto.id !== productoId) return producto;
      actualizado = { ...producto, stock: normalizarNumero(cantidadNueva) ?? 0 };
      return actualizado;
    });

    if (!actualizado) {
      throw new Error('Producto no encontrado');
    }

    stockService.setStock(productoId, actualizado.stock);
    return { ...actualizado };
  },

  async getProductosLite() {
    await delay();
    return productos.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      imagen: p.imagen,
      categoria: p.categoria,
      subcategoria: p.subcategoria,
      categoriaId: p.categoriaId,
      subcategoriaId: p.subcategoriaId,
      unidad: p.unidad,
      stock: stockService.getStock(p.id, p.stock ?? 0)
    }));
  },

  async deleteProducto(id) {
    await delay();
    productos = productos.filter((producto) => producto.id !== id);
    return true;
  }
};
