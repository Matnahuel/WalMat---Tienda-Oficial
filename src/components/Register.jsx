import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      return setError('Por favor, completa todos los campos.');
    }
    if (password !== confirmPassword) {
      return setError('Las contraseñas no coinciden.');
    }
    if (password.length < 6) {
      return setError('La contraseña debe tener al menos 6 caracteres.');
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return setError('Por favor, introduce un correo electrónico válido.');
    }

    try {
      setError('');
      setLoading(true);
      await register(username, email, password);
      navigate('/login?registrationSuccess=true');
    } catch (err) {
      console.error('Error al registrar:', err);
      setError(err.message || 'Error en el registro. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Helmet>
        <title>WalMat - Registrarse</title>
        <meta name="description" content="Regístrate en WalMat para acceder a tu cuenta y gestionar tus compras." />
      </Helmet>
      <Card className="p-4 shadow-sm" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Crear una cuenta en WalMat</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Nombre de Usuario</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresa tu nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingresa tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Crea tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
            <Form.Label>Confirmar Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirma tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mt-3" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </Button>
        </Form>
        <div className="text-center mt-3">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link>
        </div>
      </Card>
    </Container>
  );
};

export default Register;