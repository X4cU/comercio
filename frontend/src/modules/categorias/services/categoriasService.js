const wait = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

let categorias = [
  {
    id: 'cat-1',
    nombre: 'Bebidas',
    icono: 'cup-soda',
    subcategorias: [
      { id: 'sub-1', nombre: 'Gaseosas' },
      { id: 'sub-2', nombre: 'Jugos naturales' }
    ]
  },
  {
    id: 'cat-2',
    nombre: 'Lácteos',
    icono: 'milk',
    subcategorias: [
      { id: 'sub-3', nombre: 'Yogures' },
      { id: 'sub-4', nombre: 'Quesos' }
    ]
  }
];

const normalize = (value) => value.trim().toLowerCase();

const ensureUniqueCategoria = (nombre, excludeId) => {
  const exists = categorias.some(
    (categoria) => normalize(categoria.nombre) === normalize(nombre) && categoria.id !== excludeId
  );
  if (exists) {
    throw new Error('Ya existe una categoría con ese nombre');
  }
};

const ensureUniqueSubcategoria = (categoriaId, nombre, excludeId) => {
  const categoria = categorias.find((item) => item.id === categoriaId);
  if (!categoria) {
    throw new Error('Categoría no encontrada');
  }
  const exists = categoria.subcategorias.some(
    (sub) => normalize(sub.nombre) === normalize(nombre) && sub.id !== excludeId
  );
  if (exists) {
    throw new Error('Ya existe una subcategoría con ese nombre en esta categoría');
  }
};

export const categoriasService = {
  async getCategorias() {
    await wait();
    return categorias.map((categoria) => ({
      ...categoria,
      subcategorias: [...categoria.subcategorias]
    }));
  },

  async createCategoria(data) {
    await wait();
    ensureUniqueCategoria(data.nombre);

    const nuevaCategoria = {
      id: crypto.randomUUID(),
      nombre: data.nombre.trim(),
      icono: data.icono?.trim() || '',
      subcategorias: []
    };

    categorias = [nuevaCategoria, ...categorias];
    return nuevaCategoria;
  },

  async updateCategoria(id, data) {
    await wait();
    ensureUniqueCategoria(data.nombre, id);

    categorias = categorias.map((categoria) =>
      categoria.id === id
        ? { ...categoria, nombre: data.nombre.trim(), icono: data.icono?.trim() || '' }
        : categoria
    );

    return categorias.find((categoria) => categoria.id === id);
  },

  async deleteCategoria(id) {
    await wait();
    categorias = categorias.filter((categoria) => categoria.id !== id);
    return true;
  },

  async createSubcategoria(categoriaId, data) {
    await wait();
    ensureUniqueSubcategoria(categoriaId, data.nombre);

    const nuevaSubcategoria = {
      id: crypto.randomUUID(),
      nombre: data.nombre.trim()
    };

    categorias = categorias.map((categoria) =>
      categoria.id === categoriaId
        ? { ...categoria, subcategorias: [...categoria.subcategorias, nuevaSubcategoria] }
        : categoria
    );

    return nuevaSubcategoria;
  },

  async updateSubcategoria(categoriaId, subcategoriaId, data) {
    await wait();
    ensureUniqueSubcategoria(categoriaId, data.nombre, subcategoriaId);

    categorias = categorias.map((categoria) => {
      if (categoria.id !== categoriaId) return categoria;
      const subcategoriasActualizadas = categoria.subcategorias.map((sub) =>
        sub.id === subcategoriaId ? { ...sub, nombre: data.nombre.trim() } : sub
      );
      return { ...categoria, subcategorias: subcategoriasActualizadas };
    });

    const categoria = categorias.find((item) => item.id === categoriaId);
    return categoria?.subcategorias.find((sub) => sub.id === subcategoriaId);
  },

  async deleteSubcategoria(categoriaId, subcategoriaId) {
    await wait();
    categorias = categorias.map((categoria) =>
      categoria.id === categoriaId
        ? {
            ...categoria,
            subcategorias: categoria.subcategorias.filter((sub) => sub.id !== subcategoriaId)
          }
        : categoria
    );
    return true;
  }
};
