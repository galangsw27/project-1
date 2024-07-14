'use client';

import { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { useRouter } from 'next/navigation';
import { Form, Button, Container, Col, Row, Modal, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';

const IndexPage = ({ nameSession }) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [textValue, setTextValue] = useState<string>('');
  const [numbers, setNumbers] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState(nameSession.length > 0 ? nameSession[0] : ''); // Use first session or empty
  const router = useRouter();

  const handleCSVFileRead = (file: File): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        complete: (result) => {
          const phoneNumbers = result.data.map((row: string[]) => row[0]);
          resolve(phoneNumbers);
        },
        error: (error) => reject(error),
      });
    });
  };

  const handleCSVChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      const phoneNumbers = await handleCSVFileRead(file);
      setNumbers(phoneNumbers);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!csvFile || !textValue || !imageFile) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const phoneNumbers = await handleCSVFileRead(csvFile);
      const formData = new FormData();
      
      formData.append('session', selectedSession); // Use selected session
      phoneNumbers.forEach((number) => formData.append('to[]', number));
      formData.append('message', textValue);
      formData.append('image', imageFile);

      const response = await axios.post('http://localhost:5001/send-blast-message', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response:', response.data);
      const totalFail = response.data.data.failureCount;
      const totalSuccess = response.data.data.successCount;

      Swal.fire({
        title: 'Broadcast Success!',
        text: `Message Failed : ${totalFail} - Success : ${totalSuccess}`,
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      Swal.fire({
        title: 'Error!',
        text: 'There was an error sending the message.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <Container>
      <h1>Send Broadcast</h1>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="sessionSelect">
              <Form.Label>Select Session:</Form.Label>
              <Form.Select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
              >
                {nameSession && nameSession.length > 0 ? (
                  nameSession.map((session, index) => (
                    <option key={index} value={session}>{session}</option>
                  ))
                ) : (
                  <option value="">No sessions available</option>
                )}
              </Form.Select>
            </Form.Group>
            
          </Col>
          </Row>
            <br/>
          <Row>
          <Col md={6}>
            <Form.Group controlId="csvFile">
              <Form.Label>CSV File:</Form.Label>
              <Form.Control
                type="file"
                accept=".csv"
                onChange={handleCSVChange}
              />
            </Form.Group>
            <p>Download Template: <a href="/assets/template/template_csv.csv" download>Click Here</a></p>
            {numbers.length > 0 && (
              <div className="mt-2">
                <h5>Preview Numbers:</h5>
                <ul>
                  {numbers.slice(0, 5).map((number, index) => (
                    <li key={index}>{number}</li>
                  ))}
                </ul>
                {numbers.length > 5 && (
                  <Button variant="link" onClick={() => setShowModal(true)}>
                    See More
                  </Button>
                )}
              </div>
            )}
            
          </Col>
          
          <Col md={6}>
            <Form.Group controlId="imageFile">
              <Form.Label>Image File:</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-2">
                  <h5>Image Preview:</h5>
                  <img src={imagePreview} alt="Image Preview" style={{ width: '200px', height: 'auto' }} />
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>
  
        <br />
        <Form.Group controlId="textValue">
          <Form.Label>Message:</Form.Label>
          <Form.Control
            as="textarea"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            rows={10}
          />
        </Form.Group>
        <br />
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" />
              <span className="ms-2">Sending...</span>
            </>
          ) : (
            'Send'
          )}
        </Button>
      </Form>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>All Numbers</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            {numbers.map((number, index) => (
              <li key={index}>{number}</li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default IndexPage;
