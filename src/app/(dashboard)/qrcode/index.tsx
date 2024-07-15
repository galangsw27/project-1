// app/(dashboard)/qrcode/index.tsx
'use client';

import { useSession } from 'next-auth/react';
import router from 'next/router';
import React, { useState, useEffect, Fragment } from 'react';
import { Button, Card, CardGroup, Row, Col, Modal, ListGroup, Form } from 'react-bootstrap';

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

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 3 ? `${prevDots}.` : ''));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleDeleteSession = async (session: string) => {
    const response = await fetch(`http://localhost:5001/delete-session?session=${session}&key=mysupersecretkey`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert(`Session ${session} deleted successfully.`);
      router.reload();
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
        console.log(data);
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
      <CardGroup style={{ width: '100%', textAlign: 'center', backgroundColor: '#f5f5f5', borderWidth: '0' }}>
        <Row style={{ width: '100%' }}>
          <Col md={8}>
            <Card style={{ borderWidth: '0' }}>
              <Card.Body>
                {qrData.device > 0 ? (
                  <Card.Body>
                    <Card.Img variant="top" src={qrData.activeImg} alt="QR code placeholder" style={{ width: '480px' }} />
                    <Card.Text>Connected ({qrData.device})</Card.Text>
                  </Card.Body>
                ) : (
                  <>
                    <Card.Img variant="top" src={qrData.waitImg} alt="QR code placeholder" style={{ width: '480px' }} />
                    <Card.Text>Need Create Session{dots}</Card.Text>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} style={{ padding: '16px' }}>
            <h2>Account</h2>
            <Card>
              <Card.Body>
                <Card.Text>Name: {qrData.nama}</Card.Text>
                <Card.Text>Number: {qrData.number}</Card.Text>
                <Card.Text>
                  Device: {qrData.device === '0' ? 'Need to create session' : `Connected (${qrData.device})`}
                </Card.Text>
              </Card.Body>
            </Card>
            <div style={{ padding: '5px' }}>
              <Button style={{ width: '100%' }} variant="info" onClick={() => setShowCreateModal(true)}>
                Create New Session
              </Button>
            </div>
            <div style={{ padding: '5px' }}>
              <Button style={{ width: '100%' }} variant="danger" onClick={() => setShowModal(true)}>
                Delete Session
              </Button>
            </div>
          </Col>
        </Row>
      </CardGroup>

      {/* Modal for creating new session */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Session</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Session Name</Form.Label>
            <Form.Control
              type="text"
              value={newSessionName}
              onChange={(e) => setNewSessionName(e.target.value)}
              placeholder="Enter session name"
            />
          </Form.Group>
          {sessionImage && (
            <div style={{ marginTop: '10px' }}>
              <h5>QR Code:</h5>
              <img src={sessionImage} alt="Generated QR Code" style={{ width: '100%' }} />
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
      <Modal show={showModal} onHide={() => setShowModal(false)}>
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
    </Fragment>
  );
}
<h2>Server Error</h2>
}
