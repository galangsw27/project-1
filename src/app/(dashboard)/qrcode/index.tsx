// app/(dashboard)/qrcode/index.tsx
'use client';

import router from 'next/router';
import React, { useState, useEffect, Fragment } from 'react';
import { Button, Card, CardGroup, Row, Col, Modal, ListGroup, Form, Container } from 'react-bootstrap';

interface IndexProps {
  qrData:  {
    activeImg: string ;
    waitImg: string ;
    nama: string;
    number: string;
    device: string | any;
    isConnected: boolean
  };
  sessionName: string[];
}



export default function Index({ qrData, sessionName }: IndexProps) {
  if (qrData) {
  const [dots, setDots] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState('');
  const [newSessionName, setNewSessionName] = useState('');
  const [sessionImage, setSessionImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 3 ? `${prevDots}.` : ''));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleDeleteSession = async (session: string) => {
    const body = JSON.stringify({ session: selectedSession });
  
    const response = await fetch(`/api/delete-session`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json' // Tambahkan header ini jika diperlukan
      },
      body: body,
    });
  
    console.log(response);
  
    if (response.ok) {
      alert(`Session ${session} deleted successfully.`);
      window.location.reload(); // Refresh the page upon successful deletion
    } else {
      alert(`Failed to delete session ${session}.`);
    }
  
    setShowModal(false);
  };
  
  const handleCreateSession = async () => {
    setIsLoading(true);
    try {
      const body = JSON.stringify({ nameSession: newSessionName });
  
      const response = await fetch('/api/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });
  
      if (response.ok) {
        const data = await response.json();
        setSessionImage(data.qrImage);
        // alert(`Session ${newSessionName} created successfully.`);
      } else {
        const errorText = await response.text();
        let errorMessage = 'Failed to create session: Unknown error';
  
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = `Failed to create session: ${errorData.message || 'Unknown error'}`;
        } catch (jsonError) {
          errorMessage = `Failed to create session: ${errorText}`;
        }
  
        alert(errorMessage);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(`Failed to create session: ${error.message}`);
      } else {
        alert('Failed to create session: Unknown error');
      }
    } finally {
      setIsLoading(false);
      // setShowCreateModal(false);
      setNewSessionName('');
    }
  };
  
  return (
    
    <Fragment>
  <Container className="mt-4">
    <CardGroup className="bg-light border-0 rounded-3 shadow-sm p-4">
      <Row className="w-100">
        <Col md={8}>
        <h2 className="mb-4 text-primary"></h2>

          <Card className="border-0">
            
            <Card.Body className="text-center">
              {qrData.device > 0 ? (
                <div>
                  <Card.Img
                    variant="top"
                    src={qrData.activeImg}
                    alt="QR code placeholder"
                    className="img-fluid"
                    style={{ maxWidth: '480px', margin: 'auto' }}
                  />
                  <Card.Text className="mt-3">Connected ({qrData.device})</Card.Text>
                </div>
              ) : (
                <div>
                  <Card.Img
                    variant="top"
                    src={qrData.waitImg}
                    alt="QR code placeholder"
                    className="img-fluid"
                    style={{ maxWidth: '480px', margin: 'auto' }}
                  />
                  <Card.Text className="mt-3">Need Create Session{dots}</Card.Text>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="d-flex flex-column align-items-center">
          <h2 className="mb-4 text-primary">Account</h2>
          <Card className="w-100 mb-3 shadow-sm">
            <Card.Body>
              <Card.Text><strong>Name:</strong> {qrData.nama}</Card.Text>
              <Card.Text><strong>Number:</strong> {qrData.number}</Card.Text>
              <Card.Text>
                <strong>Device:</strong> {qrData.device === '0' ? 'Need to create session' : `Connected (${qrData.device})`}
              </Card.Text>
            </Card.Body>
          </Card>
          <Button className="w-100 mb-2" variant="info" onClick={() => setShowCreateModal(true)}>
            Create New Session
          </Button>
          <Button className="w-100" variant="danger" onClick={() => setShowModal(true)}>
            Delete Session
          </Button>
        </Col>
      </Row>
    </CardGroup>

    {/* Modal for creating new session */}
    <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create New Session</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Session Name</Form.Label>
          <Form.Control
            type="text"
            value={newSessionName}
            onChange={(e) => setNewSessionName(e.target.value)}
            placeholder="Enter session name"
          />
        </Form.Group>
        {sessionImage && (
          <div className="text-center mt-3">
            <h5>QR Code:</h5>
            <img src={sessionImage} alt="Generated QR Code" className="img-fluid" />
            <h6 className="mt-2 text-muted">After Scan. Please Reload Page!</h6>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={handleCreateSession} disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Session'}
        </Button>
      </Modal.Footer>
    </Modal>

    {/* Modal for selecting session to delete */}
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Select Session to Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          {sessionName.map((session) => (
            <ListGroup.Item
              key={session}
              action
              onClick={() => setSelectedSession(session)}
              className={selectedSession === session ? 'bg-warning' : ''}
            >
              {session}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Close
        </Button>
        <Button variant="danger" onClick={() => handleDeleteSession(selectedSession)} disabled={!selectedSession}>
          Confirm Delete
        </Button>
      </Modal.Footer>
    </Modal>
  </Container>
</Fragment>
  );
}
<h2>Server Error</h2>
}
