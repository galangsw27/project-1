import React from 'react'
import { Container } from 'react-bootstrap'

export default function Footer() {
  return (
    <footer className="footer border-top px-sm-2 py-2">
      <Container fluid className="text-center align-items-center flex-column flex-md-row d-flex justify-content-between">
        <div>
         
          © 2024
          Kedan Jos.
        </div>
        <div className="ms-md-auto">
          Powered by&nbsp;
          <a
            className="text-decoration-none"
            href="/"
          >
            KedanJos Team
          </a>
        </div>
      </Container>
    </footer>
  )
}
