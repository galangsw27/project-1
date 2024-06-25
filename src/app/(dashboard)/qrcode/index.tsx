'use client';

// components/Index.tsx
import React, { useState, useEffect } from 'react';
import { Button, Card, CardGroup, Row, Col } from 'react-bootstrap';
import qrPlaceholder from 'public/assets/img/wait.png';

interface IndexProps {
  qrData: any;
}

export default function Index({ qrData }: IndexProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 3 ? prevDots + '.' : ''));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <CardGroup style={{ width: '100%', textAlign: 'center', backgroundColor: '#f5f5f5', borderWidth: '0' }} >
      
      <Row style={{ width: '100%' }} >
        <Col md={8} >
          <Card style={{borderWidth: '0' }}>
            <Card.Body>
              {qrData ? (
                <Card.Body>
                  <pre>{JSON.stringify(qrData, null, 2)}</pre>
                </Card.Body>
              ) : (
                <>
                  <Card.Img variant="top" src='/assets/img/wait.png' alt="QR code placeholder" 
                    style={{ width: '480px' }}  />
                  <Card.Text>Waiting From Server{dots}</Card.Text>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} style={{padding: '16px'}}>
        <h2 >
          Account
        </h2>
          <Card>
            <Card.Body>
              <Card.Text>Name : </Card.Text>
              <Card.Text>Number : </Card.Text>
              <Card.Text>Status : </Card.Text>
              <Card.Text>Device : </Card.Text>

              {/* <Card.Subtitle>Name : </Card.Subtitle> */}
            </Card.Body>

          </Card>
          <div style={{padding: '5px'}}>
          <Button style={{width: '40%'}} variant='info'  >Settings</Button>          
          </div>

          <div style={{padding: '5px'}} >

          <Button style={{width: '40%'}} variant='danger'>Logout</Button>
          </div>
        </Col>
      </Row>
    </CardGroup>
  );
}
