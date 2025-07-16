import React from 'react';
import { useCarrito } from '../context/CarritoContext';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card, ListGroup, Alert } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { FaPlus, FaMinus, FaTrashAlt, FaShoppingCart, FaTimes } from 'react-icons/fa';

const CartView = () => {
  const { cartItems, removeFromCart, clearCart, removeItemCompletely, cartTotal, cartCount, addToCart } = useCarrito();

  if (cartItems.length === 0) {
    return (
      <Container className="my-5 text-center">
        <Helmet>
          <title>Mi eCommerce - Carrito Vacío</title>
          <meta name="description" content="Tu carrito de compras está vacío. Vuelve a la tienda para añadir productos." />
        </Helmet>
        <Alert variant="info" className="p-4">
          <h2 className="mb-3">Tu carrito está vacío <FaShoppingCart /></h2>
          <p>Parece que no has añadido ningún producto todavía.</p>
          <Link to="/" className="btn btn-primary mt-3">Volver a la tienda</Link>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Helmet>
        <title>Mi eCommerce - Carrito de Compras</title>
        <meta name="description" content="Revisa los productos que has añadido a tu carrito de compras antes de finalizar la compra." />
      </Helmet>

      <h2 className="text-center mb-4">Tu Carrito de Compras ({cartCount} ítems) <FaShoppingCart /></h2>

      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <ListGroup variant="flush">
              {cartItems.map((item) => (
                <ListGroup.Item key={item.idProducto} className="d-flex justify-content-between align-items-center py-3">
                  <div className="d-flex align-items-center">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{ width: '60px', height: '60px', objectFit: 'contain', marginRight: '15px' }}
                        className="rounded"
                      />
                    )}
                    <div>
                      <h5 className="mb-1">{item.name}</h5>
                      <p className="mb-0 text-muted">Precio unitario: ${typeof item.precio === 'number' ? item.precio.toFixed(2) : 'N/A'}</p>
                      <p className="mb-0 fw-bold">Subtotal: ${typeof item.precio === 'number' ? (item.precio * item.quantity).toFixed(2) : 'N/A'}</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => addToCart(item)}
                      className="me-2"
                    >
                      <FaPlus />
                    </Button>
                    <span className="fw-bold me-2">{item.quantity}</span>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeFromCart(item.idProducto)}
                      className="me-3"
                      disabled={item.quantity <= 1}
                    >
                      <FaMinus />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeItemCompletely(item.idProducto)}
                      title="Eliminar producto completamente"
                    >
                      <FaTrashAlt />
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Card.Footer className="d-flex justify-content-end align-items-center py-3 bg-white">
              <h4 className="mb-0 me-3">Total del Carrito:</h4>
              <h3 className="mb-0 text-primary">${cartTotal.toFixed(2)}</h3>
            </Card.Footer>
          </Card>

          <div className="d-flex justify-content-end mt-4 gap-2">
            <Button variant="warning" onClick={clearCart} className="d-flex align-items-center">
              <FaTimes className="me-2" />Vaciar Carrito
            </Button>
            <Button variant="success" className="d-flex align-items-center">
              Proceder al Pago (futuro)
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CartView;