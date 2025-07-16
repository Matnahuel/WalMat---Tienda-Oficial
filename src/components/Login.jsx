import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { FaSignInAlt } from 'react-icons/fa';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.search.includes('registrationSuccess=true')) {
      setSuccessMessage('¡Registro exitoso! Por favor, inicia sesión.');
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(username, password);
      navigate('/');
      toast.success('¡Inicio de sesión exitoso!');
    } catch (err) {
      console.error('Error de inicio de sesión:', err);
      setError(err.message || 'Error desconocido al iniciar sesión.');
      toast.error(err.message || 'Error desconocido al iniciar sesión.');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Helmet>
        <title>WalMat - Iniciar Sesión</title>
        <meta name="description" content="Inicia sesión en WalMat para acceder a tu cuenta y gestionar tus compras o administrar productos." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Card className="p-4 shadow-sm" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Iniciar Sesión en WalMat</h2>

        {successMessage && <Alert variant="success" className="mb-3">{successMessage}</Alert>}
        {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Usuario:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formBasicPassword">
            <Form.Label>Contraseña:</Form.Label>
            <Form.Control
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 d-flex align-items-center justify-content-center">
            <FaSignInAlt className="me-2" /> Entrar
          </Button>
        </Form>
        <div className="text-center mt-3">
          ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
        </div>
      </Card>
    </Container>
  );
};

export default Login;