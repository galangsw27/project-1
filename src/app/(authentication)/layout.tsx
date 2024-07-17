import { Container } from 'react-bootstrap';
import React from 'react';


export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div 
      className="dark:bg-dark min-vh-100 d-flex flex-row align-items-center position-relative" 
      style={{
        backgroundColor: '#A0DEFF',
        overflow: 'hidden', // Menyembunyikan overflow
      }}
    >
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/assets/img/bg-login.jpg)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          filter: 'blur(8px)', // Ganti nilai blur sesuai kebutuhan
          zIndex: 1,
        }}
      />
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgb(81, 43, 129, 0.6)', // Warna biru dengan opasitas
          zIndex: 2,
        }}
      />
      <Container style={{ position: 'relative', zIndex: 3 }}>

      {children}
      </Container>
    </div>
  );
}
