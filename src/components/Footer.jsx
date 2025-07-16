import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 p-4 footer">
      <Container>
        <Row className="justify-content-center text-center">
          <Col md={4} className="mb-3 mb-md-0">
            <h5>WalMat</h5>
            <p>&copy; {new Date().getFullYear()} Todos los derechos reservados.</p>
          </Col>
          <Col md={4} className="mb-3 mb-md-0">
            <h5>Síguenos</h5>
            <div className="d-flex justify-content-center">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white me-3">
                <FaFacebook size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white me-3">
                <FaTwitter size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white">
                <FaInstagram size={24} />
              </a>
            </div>
          </Col>
          <Col md={4}>
            <h5>Contacto</h5>
            <p>Email: info@walmat.com</p>
            <p>Teléfono: +123 456 7890</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;