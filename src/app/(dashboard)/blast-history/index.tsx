'use client'
import React, { useState } from 'react'
import { Button, Table, Card, CardBody, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap'

// Define the type for the session data
export interface Session {
  sessionId: string;
  session_name: string;
  success_count: number;
  failure_count: number;
  skipped_count: number;
}

interface IndexProps {
  sessions: Session[]
}

const Index: React.FC<IndexProps> = ({ sessions }) => {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [showModal, setShowModal] = useState(false)

  const handleDetailClick = (session: Session) => {
    setSelectedSession(session)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedSession(null)
  }

  return (
    <Card>
      <Card.Header>Blast History</Card.Header>
      <CardBody>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Session Name</th>
              <th>Status</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session, index) => (
              <tr key={session.sessionId}>
                <td>{index + 1}</td>
                <td>{session.session_name}</td>
                <td>
                  <span 
                    style={{
                      color: session ? 'white' : 'red',
                      borderRadius: '5px',
                      padding: '2px 6px',
                      backgroundColor: session  ? 'green' : '#f8d7da',
                      display: 'inline-block'
                    }}
                  >
                    {session ? 'Success' : 'Failure'}
                  </span>
                </td>
                <td>
                  <Button variant="link" style={{ textDecoration: 'none' }} onClick={() => handleDetailClick(session)}>
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {selectedSession && (
          <Modal show={showModal} onHide={handleCloseModal}>
            <ModalHeader closeButton>
              <Modal.Title>Session Details</Modal.Title>
            </ModalHeader>
            <ModalBody>
              <p><strong>Success Count:</strong> {selectedSession.success_count}</p>
              <p><strong>Failure Count:</strong> {selectedSession.failure_count}</p>
              <p><strong>Skipped Count:</strong> {selectedSession.skipped_count}</p>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
            </ModalFooter>
          </Modal>
        )}
      </CardBody>
    </Card>
  )
}

export default Index;
