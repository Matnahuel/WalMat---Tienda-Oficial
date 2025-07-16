import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Row, Col, Form, Pagination } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import ProductCard from './components/ProductCard';
import CartView from './components/CartView';
import Login from './components/Login';
import Register from './components/Register';
import RutaProtegida from './components/RutaProtegida';
import ProductManagement from './components/ProductManagement';
import Footer from './components/Footer';
import { useCarrito } from './context/CarritoContext';
import { useAuth } from './context/AuthContext';
import { useProductsApi } from './hooks/useProductsApi';
import './App.css';

const AboutUs = () => {
  return (
    <Container className="my-5 p-4 bg-light rounded shadow-sm text-center">
      <h3>Sobre WalMat</h3>
      <p>
        En WalMat, nos apasiona conectar a las personas con los productos que aman. Fundada con la visión de ofrecer una experiencia de compra en línea sencilla y satisfactoria, nos esforzamos por brindar una amplia selección de artículos de alta calidad, precios competitivos y un servicio al cliente excepcional. ¡Tu satisfacción es nuestra prioridad!
      </p>
    </Container>
  );
};

const Home = ({ searchTerm, selectedCategory }) => {
  const { products, loading, error } = useProductsApi();

  const [productsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAndCategorizedProducts = products.filter(product => {
    const productName = product.name ? product.name.toLowerCase() : '';
    const productDescription = product.description ? product.description.toLowerCase() : '';
    const productCategory = product.categoria ? product.categoria.toLowerCase() : '';
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const matchesSearch = productName.includes(lowerCaseSearchTerm) ||
                          productDescription.includes(lowerCaseSearchTerm);

    const matchesCategory = selectedCategory === '' || productCategory === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredAndCategorizedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredAndCategorizedProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  if (loading) {
    return <div className="text-center p-5">Cargando productos...</div>;
  }

  if (error) {
    return <div className="text-center p-5 text-danger">Error al cargar productos: {error}</div>;
  }

  if (filteredAndCategorizedProducts.length === 0 && (searchTerm || selectedCategory)) {
    return (
      <Container className="my-4 text-center">
        <h2>No se encontraron productos para "{searchTerm}" en la categoría seleccionada.</h2>
        <p>Intenta con otra palabra clave o categoría, o <Link to="/">ve todos los productos</Link>.</p>
      </Container>
    );
  }

  if (filteredAndCategorizedProducts.length === 0 && !searchTerm && !selectedCategory) {
    return <div className="text-center p-5">No hay productos disponibles en la tienda.</div>;
  }

  return (
    <Container className="my-4 content-min-height">
      <Helmet>
        <title>WalMat - Tienda de Productos</title>
        <meta name="description" content="Explora nuestra amplia selección de productos de alta calidad para todas tus necesidades." />
      </Helmet>
      <AboutUs />
      <h2 className="text-center mb-4">Nuestros Productos</h2>
      <Row xs={1} md={2} lg={4} className="g-4">
        {currentProducts.map(product => (
          <Col key={product.idProducto}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>

      {totalPages > 1 && (
        <Row className="mt-4">
          <Col className="d-flex justify-content-center">
            <Pagination>
              <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
            </Pagination>
          </Col>
        </Row>
      )}
    </Container>
  );
};

const App = () => {
  const { cartCount } = useCarrito();
  const { isAuthenticated, logout } = useAuth();
  const { products } = useProductsApi();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const masterApiCategories = [
    'categoria 1', 'categoria 2', 'categoria 3', 'categoria 4', 'categoria 5',
    'categoria 6', 'categoria 7', 'categoria 8', 'categoria 9', 'categoria 10',
    'boca', 'hola'
  ];

  const categoryDisplayNameMap = {
    'categoria 1': 'Electrónica', 'categoria 2': 'Hogar y Cocina',
    'categoria 3': 'Ropa y Accesorios', 'categoria 4': 'Libros y Papelería',
    'categoria 5': 'Juguetes y Juegos', 'categoria 6': 'Deportes y Aire Libre',
    'categoria 7': 'Alimentos y Bebidas', 'categoria 8': 'Belleza y Salud',
    'categoria 9': 'Automotriz', 'categoria 10': 'Herramientas',
    'boca': 'Merchandising', 'hola': 'Miscelánea'
  };

  const categoryReverseMap = Object.entries(categoryDisplayNameMap).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});

  const getUniqueDisplayCategories = (productsList) => {
    const existingRawCategories = productsList.map(p => p.categoria).filter(Boolean);
    const allUniqueRawCategories = [...new Set([...masterApiCategories, ...existingRawCategories])];
    const displayCategories = allUniqueRawCategories.map(cat => categoryDisplayNameMap[cat.toLowerCase()] || cat);
    return ['Todas', ...new Set(displayCategories)].sort((a, b) => {
        if (a === 'Todas') return -1;
        if (b === 'Todas') return 1;
        return a.localeCompare(b);
    });
  };

  const uniqueDisplayCategories = getUniqueDisplayCategories(products);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    const selectedDisplayName = e.target.value;
    if (selectedDisplayName === 'Todas') {
      setSelectedCategory('');
    } else {
      const originalCategory = categoryReverseMap[selectedDisplayName] || selectedDisplayName;
      setSelectedCategory(originalCategory);
    }
  };

  return (
    <div className="app-container">
      <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">WalMat</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Tienda</Nav.Link>
              {isAuthenticated && (
                <>
                  <Nav.Link as={Link} to="/cart">
                    Carrito ({cartCount})
                  </Nav.Link>
                  <Nav.Link as={Link} to="/admin-products">
                    Admin Productos
                  </Nav.Link>
                </>
              )}
            </Nav>

            <Form className="d-flex my-2 my-lg-0 me-3">
              <Form.Control
                type="search"
                placeholder="Buscar productos..."
                className="me-2"
                aria-label="Buscar"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </Form>

            <Form.Select
              aria-label="Filtrar por categoría"
              value={selectedCategory === '' ? 'Todas' : categoryDisplayNameMap[selectedCategory.toLowerCase()] || selectedCategory}
              onChange={handleCategoryChange}
              className="w-auto my-2 my-lg-0"
              style={{ maxWidth: '180px' }}
            >
              {uniqueDisplayCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Form.Select>

            <Nav className="ms-auto">
              {isAuthenticated ? (
                <Button variant="outline-light" onClick={logout} className="ms-3">
                  Cerrar Sesión
                </Button>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">Iniciar Sesión</Nav.Link>
                  <Nav.Link as={Link} to="/register" className="ms-2">Registrarse</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<Home searchTerm={searchTerm} selectedCategory={selectedCategory} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<RutaProtegida />}>
            <Route path="/cart" element={<CartView />} />
            <Route path="/admin-products" element={<ProductManagement />} />
          </Route>
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default App;