import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const MOCKAPI_URL = "https://6876c8a2dba809d901ed184f.mockapi.io/PFR/productos"; 

export const useProductsApi = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(MOCKAPI_URL);
      setProducts(response.data);
    } catch (err) {
      console.error("Error al obtener productos:", err);
      setError("No se pudieron cargar los productos. Por favor, verifica tu conexión o inténtalo más tarde.");
    } finally {
      setLoading(false);
    }
  }, []); 

  const addProduct = async (newProductData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(MOCKAPI_URL, newProductData);
      setProducts((prevProducts) => [...prevProducts, response.data]);
      return response.data; 
    } catch (err) {
      console.error("Error al agregar producto:", err);
      setError("No se pudo agregar el producto. Inténtalo de nuevo.");
      throw err; 
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (updatedProductData) => { 
    setLoading(true);
    setError(null);
    try {
      if (!updatedProductData.idProducto) {
        throw new Error("ID del producto no proporcionado para la actualización.");
      }
      const response = await axios.put(`${MOCKAPI_URL}/${updatedProductData.idProducto}`, updatedProductData);
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.idProducto === response.data.idProducto ? response.data : p
        )
      );
      return response.data; 
    } catch (err) {
      console.error(`Error al actualizar producto con ID ${updatedProductData?.idProducto || 'desconocido'}:`, err);
      setError("No se pudo actualizar el producto. Verifica los datos e inténtalo de nuevo.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (idProducto) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${MOCKAPI_URL}/${idProducto}`);
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p.idProducto !== idProducto)
      );
    } catch (err) {
      console.error(`Error al eliminar producto con ID ${idProducto}:`, err);
      setError("No se pudo eliminar el producto.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return { products, loading, error, getProducts, addProduct, updateProduct, deleteProduct, setProducts };
};