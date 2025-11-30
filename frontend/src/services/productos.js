import api from './api';

const handleError = (error) => {
  const message = error.response?.data?.message || 'No se pudo completar la operación de productos';
  console.error('Productos API error', error);
  throw new Error(message);
};

export const productosService = {
  async getProductos() {
    try {
      const { data } = await api.get('/api/productos');
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  async getProducto(id) {
    try {
      const { data } = await api.get(`/api/productos/${id}`);
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  async crearProducto(formData) {
    try {
      const { data } = await api.post('/api/productos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  async actualizarProducto(id, formData) {
    try {
      const { data } = await api.put(`/api/productos/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  async cambiarEstadoProducto(id) {
    try {
      const { data } = await api.patch(`/api/productos/${id}/estado`);
      return data;
    } catch (error) {
      handleError(error);
    }
  }
};
