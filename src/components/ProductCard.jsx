import React from 'react';
import { useCarrito } from '../context/CarritoContext';
import { Card, Button } from 'react-bootstrap';

const ProductCard = ({ product }) => {
  const { addToCart } = useCarrito();

  const displayPrice = typeof product.precio === 'number'
    ? product.precio.toFixed(2)
    : 'N/A';

  return (
    <Card className="h-100 shadow-sm">
      {product.imageUrl && (
        <Card.Img
          variant="top"
          src={product.imageUrl}
          alt={product.name}
          style={{ height: '180px', objectFit: 'contain', padding: '10px' }}
        />
      )}
      <Card.Body className="d-flex flex-column">
        <Card.Title>{product.name}</Card.Title>
        <Card.Text className="mb-auto">{product.description}</Card.Text>
        <Card.Text className="fw-bold mt-2">Precio: ${displayPrice}</Card.Text>
        <Button
          variant="success"
          onClick={() => addToCart(product)}
          className="mt-3 w-100"
        >
          Agregar al Carrito
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;