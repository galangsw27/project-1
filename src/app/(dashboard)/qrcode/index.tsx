'use client';

import React, { useState, useEffect, Fragment } from 'react';
import { Button, Card, CardGroup, Row, Col, Modal, ListGroup, Form, Container, Spinner } from 'react-bootstrap';
import router from 'next/router';

interface IndexProps {
  qrData: {
    activeImg: string;
    waitImg: string;
    nama?: string;
    role?: string;
    device: number; // Changed to number
    isConnected: boolean;
  };
  sessionName: string[];
  sessionId: number[];
}

interface User {
  id: string;
  email: string;
}

export default function Index({ qrData, sessionName, sessionId }: IndexProps) {
  const [dots, setDots] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string>('');
  const [newSessionName, setNewSessionName] = useState<string>('');
  const [sessionImage, setSessionImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 3 ? `${prevDots}.` : ''));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleDeleteSession = async () => {
    const body = JSON.stringify({ session: selectedSession });
    try {
      const response = await fetch(`/api/delete-session`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      if (response.ok) {
        // Ideally, fetch session data again to update the UI without reloading
        alert(`Session ${selectedSession} deleted successfully.`);
        setSelectedSession('');
      } else {
        const errorText = await response.text();
        alert(`Failed to delete session ${selectedSession}: ${errorText}`);
      }
    } catch (error) {
      alert(`Failed to delete session ${selectedSession}: ${error}`);
    } finally {
      setShowModal(false);
    }
  };

  const handleCreateSession = async () => {
    setIsLoading(true);
    try {
      const body = JSON.stringify({ nameSession: newSessionName });
      const response = await fetch(`/api/create-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      if (response.ok) {
        const data = await response.json();
        setSessionImage(data.qrImage);
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
      alert(`Failed to create session: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
      setNewSessionName('');
    }
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/get-all-users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data); // Assuming the API response contains a `users` array
      } else {
        alert('Failed to fetch users');
      }
    } catch (error) {
      alert('Failed to fetch users');
    } finally{
      setIsLoading(false);
    }
  };

  const handleAssignSession = async () => {
    try {
      const body = JSON.stringify({ sessionName: selectedSession, userId: selectedUser });
      const response = await fetch(`/api/assign-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      if (response.ok) {
        alert(`Session assigned successfully to user ID ${selectedUser}.`);
      } else {
        alert('Failed to assign session');
      }
    } catch (error) {
      alert(`Failed to assign session: ${error}`);
    } finally {
      setSelectedUser('');
      setShowAssignModal(false);
    }
  };

  return (
    <Fragment>
      <Container className="mt-4">
        <CardGroup className="bg-light dark:bg-secondary border-0 rounded-3 shadow-sm p-4">
          <Row className="w-100">
            <Col md={8}>
              <h2 className="mb-4 text-primary"></h2>
              <Card className="border-0">
                <Card.Body className="text-center dark:bg-secondary">
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
                  <Card.Text><strong>Name:</strong> {qrData.nama || 'N/A'}</Card.Text>
                  <Card.Text><strong>Role:</strong> {qrData.role || 'N/A'}</Card.Text>
                  <Card.Text>
                    <strong>Device:</strong> {qrData.device === 0 ? 'Need to create session' : `Connected (${qrData.device})`}
                  </Card.Text>
                </Card.Body>
              </Card>
              <Button className="w-100 mb-2" variant="info" onClick={() => setShowCreateModal(true)}>
                Create New Session
              </Button>
              <Button className="w-100 mb-2" variant="warning" onClick={() => { setShowAssignModal(true); fetchUsers(); }}>
                Assign Session
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
            <Button variant="danger" onClick={handleDeleteSession} disabled={!selectedSession}>
              Confirm Delete
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal for assigning session */}
        <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Assign Session to User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Select Session</Form.Label>
              {sessionName.map((session, index) => (
                <Form.Check 
                  type="radio" // Changed to radio button for single selection
                  key={index} 
                  label={session} 
                  value={session} 
                  checked={selectedSession === session}
                  onChange={() => setSelectedSession(session)} 
                />
              ))}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Select a user</Form.Label>
              {isLoading ? (
                <Spinner animation="border" /> // Display spinner while loading
              ) : (
                <Form.Control
                  as="select"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.email}
                    </option>
                  ))}
                </Form.Control>
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAssignSession} disabled={!selectedSession || !selectedUser}>
              Assign Session
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Fragment>
  );
}
