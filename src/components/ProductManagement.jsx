import React, { useState } from 'react';
import { Container, Form, Button, Table, Alert, Modal } from 'react-bootstrap';
import { useProductsApi } from '../hooks/useProductsApi';
import { Helmet } from 'react-helmet';

const ProductManagement = () => {
  const { products, loading, error, addProduct, updateProduct, deleteProduct } = useProductsApi();

  const [newProduct, setNewProduct] = useState({
    name: '',
    precio: '',
    imgUrl: '',
    description: '',
    categoria: ''
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const masterApiCategories = [
    'categoria 1',
    'categoria 2',
    'categoria 3',
    'categoria 4',
    'categoria 5',
    'categoria 6',
    'categoria 7',
    'categoria 8',
    'categoria 9',
    'categoria 10',
    'boca',
    'hola'
  ];

  const categoryDisplayNameMap = {
    'categoria 1': 'Electrónica',
    'categoria 2': 'Hogar y Cocina',
    'categoria 3': 'Ropa y Accesorios',
    'categoria 4': 'Libros y Papelería',
    'categoria 5': 'Juguetes y Juegos',
    'categoria 6': 'Deportes y Aire Libre',
    'categoria 7': 'Alimentos y Bebidas',
    'categoria 8': 'Belleza y Salud',
    'categoria 9': 'Automotriz',
    'categoria 10': 'Herramientas',
    'boca': 'Merchandising',
    'hola': 'Miscelánea'
  };

  const categoryReverseMap = Object.entries(categoryDisplayNameMap).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});

  const getDisplayCategoriesForManagement = (productsList) => {
    const existingRawCategories = productsList.map(p => p.categoria).filter(Boolean);
    const allUniqueRawCategories = [...new Set([...masterApiCategories, ...existingRawCategories])];
    const displayCategories = allUniqueRawCategories.map(cat => categoryDisplayNameMap[cat.toLowerCase()] || cat);
    return [...new Set(displayCategories)].sort();
  };

  const displayCategories = getDisplayCategoriesForManagement(products);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct({ ...editingProduct, [name]: value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (newProduct.name && newProduct.precio && newProduct.categoria) {
      const productToAdd = {
        ...newProduct,
        precio: parseFloat(newProduct.precio)
      };
      await addProduct(productToAdd);
      setNewProduct({ name: '', precio: '', imgUrl: '', description: '', categoria: '' });
    } else {
      alert('Por favor, completa al menos el nombre, precio y categoría.');
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct({ ...product });
    setShowEditModal(true);
  };

  const handleUpdateSubmit = async () => {
    if (editingProduct && editingProduct.idProducto) {
      const productToUpdate = {
        ...editingProduct,
        precio: parseFloat(editingProduct.precio)
      };
      await updateProduct(productToUpdate);
      setShowEditModal(false);
      setEditingProduct(null);
    }
  };

  const handleDeleteClick = async (idProducto) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      await deleteProduct(idProducto);
    }
  };

  if (loading) {
    return <Container className="my-4 text-center"><Alert variant="info">Cargando productos...</Alert></Container>;
  }

  if (error) {
    return <Container className="my-4 text-center"><Alert variant="danger">Error: {error}</Alert></Container>;
  }

  return (
    <Container className="my-4">
      <Helmet>
        <title>Mi eCommerce - Gestión de Productos</title>
        <meta name="description" content="Administra los productos de tu tienda: añade, edita o elimina productos existentes." />
      </Helmet>

      <h2 className="mb-4 text-center">Gestión de Productos</h2>

      <div className="mb-5 p-4 border rounded shadow-sm bg-light">
        <h3>Agregar Nuevo Producto</h3>
        <Form onSubmit={handleAddSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre del Producto</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              name="precio"
              value={newProduct.precio}
              onChange={handleInputChange}
              step="0.01"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>URL de la Imagen</Form.Label>
            <Form.Control
              type="text"
              name="imgUrl"
              value={newProduct.imgUrl}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
              rows={3}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              name="categoria"
              value={categoryDisplayNameMap[newProduct.categoria?.toLowerCase()] || newProduct.categoria || ''}
              onChange={(e) => {
                const selectedDisplayName = e.target.value;
                const originalCategory = categoryReverseMap[selectedDisplayName] || selectedDisplayName;
                setNewProduct({ ...newProduct, categoria: originalCategory });
              }}
              required
            >
              <option value="">Selecciona una categoría</option>
              {displayCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Button variant="primary" type="submit">
            Agregar Producto
          </Button>
        </Form>
      </div>

      <h3 className="mb-3 text-center">Productos Existentes</h3>
      {products.length === 0 ? (
        <Alert variant="info" className="text-center">No hay productos en la tienda.</Alert>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.idProducto}>
                <td>{product.idProducto}</td>
                <td>{product.name}</td>
                <td>${typeof product.precio === 'number' ? product.precio.toFixed(2) : 'N/A'}</td>
                <td>{categoryDisplayNameMap[product.categoria?.toLowerCase()] || product.categoria || 'N/A'}</td>
                <td>
                  <Button variant="info" size="sm" className="me-2" onClick={() => handleEditClick(product)}>
                    Editar
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteClick(product.idProducto)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingProduct && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nombre del Producto</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={editingProduct.name}
                  onChange={handleEditInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Precio</Form.Label>
                <Form.Control
                  type="number"
                  name="precio"
                  value={editingProduct.precio}
                  onChange={handleEditInputChange}
                  step="0.01"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>URL de la Imagen</Form.Label>
                <Form.Control
                  type="text"
                  name="imgUrl"
                  value={editingProduct.imgUrl}
                  onChange={handleEditInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={editingProduct.description}
                  onChange={handleEditInputChange}
                  rows={3}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Categoría</Form.Label>
                <Form.Select
                  name="categoria"
                  value={categoryDisplayNameMap[editingProduct.categoria?.toLowerCase()] || editingProduct.categoria || ''}
                  onChange={(e) => {
                    const selectedDisplayName = e.target.value;
                    let categoryToSet = '';
                    if (selectedDisplayName !== '') {
                      categoryToSet = categoryReverseMap[selectedDisplayName] || selectedDisplayName;
                    }
                    setEditingProduct({ ...editingProduct, categoria: categoryToSet });
                  }}
                >
                  <option value="">Selecciona una categoría</option>
                  {displayCategories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpdateSubmit}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductManagement;