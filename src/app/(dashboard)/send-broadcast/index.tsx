'use client';

import { Key, ReactNode, useState } from 'react';
import Papa from 'papaparse';
import { useRouter } from 'next/navigation';
import { Form, Button, Container, Col, Row, Modal, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

interface IndexPageProps {
  nameSession: any; // Specify the type of nameSession
}

const IndexPage: React.FC<IndexPageProps> = ({ nameSession }) => {  
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [textValue, setTextValue] = useState<string>('');
  const [numbers, setNumbers] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);
  const [showModalLoading, setShowModalLoading] = useState(false);

  const [minDelay, setMinDelay] = useState<number>(0);
  const [maxDelay, setMaxDelay] = useState<number>(0);

  const [selectedSession, setSelectedSession] = useState(nameSession.length > 0 ? nameSession[0] : '');
  const router = useRouter();



  const handleCSVFileRead = (file: File): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        complete: (result) => {
          const phoneNumbers: any = result ? result.data.map((row: any) => row[0]): [];
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

    setLoadingSend(true);
    setShowModalLoading(true);

    function generateRandomString(length: number) {
      let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '#k3D4n'; // Start with the hashtag
      let charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }
    

    try {
      const phoneNumbers = await handleCSVFileRead(csvFile);
      const formData = new FormData();

      formData.append('session', selectedSession);
      formData.append('minDelay', minDelay.toString());
      formData.append('maxDelay', maxDelay.toString());
      phoneNumbers.forEach((number) => formData.append('to[]', number));
      let randomString = generateRandomString(5); 
      formData.append('message', textValue+`\n`+ randomString);
      formData.append('image', imageFile);

      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }


      // Fungsi untuk menangani timeout
    const timeout = (ms: number) => new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Request timed out')), ms));

    // AbortController untuk membatalkan request
    const controller = new AbortController();
    const signal = controller.signal;

    const response = await Promise.race([
      fetch('/api/send-blast-message', {
        method: 'POST',
        body: formData,
        signal,
      }),
      timeout(24 * 60 * 60 * 1000) // 24 jam dalam milidetik
    ]);

      const data = await response.json();
      // console.log('ini data resp:', data)

      const totalFail = data.data.failureCount;
      const totalSuccess = data.data.successCount;
      const totalSkipped = data.data.skippedCount;

      Swal.fire({
        title: 'Broadcast Success!',
        text: `Message Failed : ${totalFail} - Success : ${totalSuccess} - Skipped : ${totalSkipped}`,
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
      setLoadingSend(false);
      setShowModalLoading(false);

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
    <Container style={{ maxWidth: '1000px', marginTop: '50px' }}>
    <h1 className="text-center mb-4" style={{ color: '#007bff' }}>Send Broadcast</h1>
    <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light dark:bg-secondary">
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="sessionSelect">
            <Form.Label>Select Session:</Form.Label>
            <Form.Select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
            >
              {nameSession && nameSession.length > 0 ? (
                nameSession.map((session: string | undefined, index: Key | null | undefined) => (
                  <option key={index} value={session}>{session}</option>
                ))
              ) : (
                <option value="">No sessions available</option>
              )}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="csvFile">
            <Form.Label>CSV File:</Form.Label>
            <Form.Control
              type="file"
              accept=".csv"
              onChange={handleCSVChange}
              className="mb-2"
            />
            <p className="mt-2">
              Download Template: <a href="/assets/template/template_csv.csv" download>Click Here</a>
            </p>
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
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="imageFile">
            <Form.Label>Image File:</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mb-2"
            />
            {imagePreview && (
              <div className="text-center mt-2">
                <h5>Image Preview:</h5>
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="img-fluid rounded border"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </div>
            )}
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="minDelay">
              <Form.Label>Minimum Delay (ms):</Form.Label>
              <Form.Control
                type="number"
                value={minDelay}
                onChange={(e) => setMinDelay(parseInt(e.target.value))}
                min="0"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="maxDelay">
              <Form.Label>Maximum Delay (ms):</Form.Label>
              <Form.Control
                type="number"
                value={maxDelay}
                onChange={(e) => setMaxDelay(parseInt(e.target.value))}
                min="0"
              />
            </Form.Group>
          </Col>
        </Row>
      <Form.Group controlId="textValue" className="mb-3">
        <Form.Label>Message:</Form.Label>
        <Form.Control
          as="textarea"
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          rows={10}
          style={{ resize: 'none' }}
          className="border-0 shadow-sm"
        />
      </Form.Group>
      <div className="d-flex justify-content-center mb-4">
        <Button
          variant="primary"
          type="submit"
          disabled={loadingSend}
          style={{ width: '150px' }}
        >
          {loadingSend ? (
            <>
              <Spinner animation="border" size="sm" />
              <span className="ms-2">Sending...</span>
            </>
          ) : (
            'Send'
          )}
        </Button>
      </div>
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

    <Modal show={showModalLoading} centered>
        <Modal.Body>
          <div className="d-flex justify-content-center align-items-center">
            <Spinner animation="border" role="status">
              <span className="sr-only">Sending...</span>
            </Spinner>
            <span className="ml-2">Sedang mengirim semua pesan...</span>
          </div>
        </Modal.Body>
      </Modal>
  </Container>
  );
};

export default IndexPage;
