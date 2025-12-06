import { useEffect, useMemo, useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { CategoriaForm } from '../components/CategoriaForm';
import { CategoriaTable } from '../components/CategoriaTable';
import { SubcategoriaForm } from '../components/SubcategoriaForm';
import { categoriasService } from '../services/categoriasService';

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
    <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-50">{title}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Completa los campos para continuar.</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          aria-label="Cerrar"
        >
          ✕
        </button>
      </div>
      {children}
    </div>
  </div>
);

const ConfirmDialog = ({ title, description, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{title}</h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{description}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
);

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoriaModal, setCategoriaModal] = useState({ open: false, data: null });
  const [subcategoriaModal, setSubcategoriaModal] = useState({ open: false, data: null });
  const [confirmDialog, setConfirmDialog] = useState(null);

  useEffect(() => {
    categoriasService
      .getCategorias()
      .then((data) => setCategorias(data))
      .catch(() => setError('No se pudieron cargar las categorías'))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveCategoria = async (data) => {
    try {
      setError('');
      if (categoriaModal.data?.id) {
        const updated = await categoriasService.updateCategoria(categoriaModal.data.id, data);
        setCategorias((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      } else {
        const created = await categoriasService.createCategoria(data);
        setCategorias((prev) => [created, ...prev]);
      }
      setCategoriaModal({ open: false, data: null });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveSubcategoria = async (data) => {
    try {
      setError('');
      if (subcategoriaModal.data?.id) {
        const updated = await categoriasService.updateSubcategoria(
          data.categoriaId,
          subcategoriaModal.data.id,
          data
        );
        setCategorias((prev) =>
          prev.map((categoria) =>
            categoria.id === data.categoriaId
              ? {
                  ...categoria,
                  subcategorias: categoria.subcategorias.map((sub) =>
                    sub.id === updated.id ? updated : sub
                  )
                }
              : categoria
          )
        );
      } else {
        const created = await categoriasService.createSubcategoria(data.categoriaId, data);
        setCategorias((prev) =>
          prev.map((categoria) =>
            categoria.id === data.categoriaId
              ? { ...categoria, subcategorias: [...categoria.subcategorias, created] }
              : categoria
          )
        );
      }
      setSubcategoriaModal({ open: false, data: null });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCategoria = (categoria) => {
    setConfirmDialog({
      title: 'Eliminar categoría',
      description: `¿Seguro que deseas eliminar "${categoria.nombre}"? Esta acción no se puede deshacer.`,
      onConfirm: async () => {
        await categoriasService.deleteCategoria(categoria.id);
        setCategorias((prev) => prev.filter((item) => item.id !== categoria.id));
        setConfirmDialog(null);
      },
      onCancel: () => setConfirmDialog(null)
    });
  };

  const handleDeleteSubcategoria = (categoria, subcategoria) => {
    setConfirmDialog({
      title: 'Eliminar subcategoría',
      description: `¿Quieres eliminar "${subcategoria.nombre}" de ${categoria.nombre}?`,
      onConfirm: async () => {
        await categoriasService.deleteSubcategoria(categoria.id, subcategoria.id);
        setCategorias((prev) =>
          prev.map((item) =>
            item.id === categoria.id
              ? {
                  ...item,
                  subcategorias: item.subcategorias.filter((sub) => sub.id !== subcategoria.id)
                }
              : item
          )
        );
        setConfirmDialog(null);
      },
      onCancel: () => setConfirmDialog(null)
    });
  };

  const selectedCategoria = useMemo(
    () => categorias.find((item) => item.id === subcategoriaModal.data?.categoriaId),
    [categorias, subcategoriaModal]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Gestión de Categorías y Subcategorías
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Administra la jerarquía de productos con una experiencia moderna y lista para integrar con backend.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCategoriaModal({ open: true, data: null })}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <PlusIcon className="h-5 w-5" /> Nueva categoría
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Cargando categorías...</p>
        ) : (
          <CategoriaTable
            categorias={categorias}
            onEditCategoria={(categoria) => setCategoriaModal({ open: true, data: categoria })}
            onDeleteCategoria={handleDeleteCategoria}
            onNewSubcategoria={(categoria) =>
              setSubcategoriaModal({ open: true, data: { categoriaId: categoria.id } })
            }
            onEditSubcategoria={(subcategoria) => setSubcategoriaModal({ open: true, data: subcategoria })}
            onDeleteSubcategoria={handleDeleteSubcategoria}
          />
        )}
      </div>

      {categoriaModal.open && (
        <Modal
          title={categoriaModal.data ? 'Editar categoría' : 'Nueva categoría'}
          onClose={() => setCategoriaModal({ open: false, data: null })}
        >
          <CategoriaForm
            initialData={categoriaModal.data}
            onSubmit={handleSaveCategoria}
            onCancel={() => setCategoriaModal({ open: false, data: null })}
          />
        </Modal>
      )}

      {subcategoriaModal.open && (
        <Modal
          title={subcategoriaModal.data?.id ? 'Editar subcategoría' : 'Nueva subcategoría'}
          onClose={() => setSubcategoriaModal({ open: false, data: null })}
        >
          <SubcategoriaForm
            categories={categorias}
            initialData={subcategoriaModal.data}
            onSubmit={handleSaveSubcategoria}
            onCancel={() => setSubcategoriaModal({ open: false, data: null })}
          />
          {selectedCategoria && (
            <div className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-100">
              Subcategoría asociada a <span className="font-semibold">{selectedCategoria.nombre}</span>
            </div>
          )}
        </Modal>
      )}

      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          description={confirmDialog.description}
          onConfirm={confirmDialog.onConfirm}
          onCancel={confirmDialog.onCancel}
        />
      )}
    </div>
  );
}
