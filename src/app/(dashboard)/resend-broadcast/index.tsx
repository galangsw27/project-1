'use client';

import { Key, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Button, Container, Col, Row, Modal, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

interface IndexPageProps {
  nameSession: any; // Specify the type of nameSession
}

const IndexPage: React.FC<IndexPageProps> = ({ nameSession }) => {  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [textValue, setTextValue] = useState<string>('');
  const [minDelay, setMinDelay] = useState<number>(0);
  const [maxDelay, setMaxDelay] = useState<number>(0);
  const [loadingReSend, setLoadingReSend] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [selectedSession, setSelectedSession] = useState(nameSession.length > 0 ? nameSession[0] : '');
  const router = useRouter();

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSession) {
      alert('Please select a session');
      return;
    }

    if (!textValue || !imageFile || minDelay < 0 || maxDelay < 0 || minDelay > maxDelay) {
      alert('Please fill in all fields with valid values');
      return;
    }

    setLoadingReSend(true);
    setShowModal(true);

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
      const formData = new FormData();
      formData.append('minDelay', minDelay.toString());
      formData.append('maxDelay', maxDelay.toString());
      formData.append('session', selectedSession);
      let randomString = generateRandomString(5);
      formData.append('editedMessage', textValue + `\n` + randomString);
      formData.append('image', imageFile);

      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }


      // Kirim data ke server-side endpoint Next.js
      const response = await fetch('/api/resend-all-messages', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }


      const data = await response.json();
      // console.log('resp', data)

      const totalFail = data.data.failureResendCount;
      const totalSuccess = data.data.resendCount;

      Swal.fire({
        title: 'Re-send Success!',
        text: `Message Failed : ${totalFail} - Success : ${totalSuccess}`,
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error('Error resending messages:', error);
      Swal.fire({
        title: 'Error!',
        text: 'There was an error resending the messages.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoadingReSend(false);
      setShowModal(false);
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
    <Container className="mt-4 ">
      <h1 className="mb-4 text-center">Resend Broadcast</h1>
      <Form onSubmit={handleResend} className="p-4 border rounded shadow-sm bg-light dark:bg-secondary">
        <Row className="mb-3 ">
          <Col md={6} >
            <Form.Group controlId="sessionSelect">
              <Form.Label >Select Session:</Form.Label>
              <Form.Select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
              >
                {nameSession && nameSession.length > 0 ? (
                  nameSession.map((session: string, index: Key | null | undefined) => (
                    <option key={index} value={session}>{session}</option>
                  ))
                ) : (
                  <option value="">No sessions available</option>
                )}
              </Form.Select>
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
                <div className="text-center">
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
            className="border-0 shadow-sm"
          />
        </Form.Group>
        <Button
          type="submit"
          variant="success"
          className="w-100"
          disabled={loadingReSend}
        >
          {loadingReSend ? (
            <>
              <Spinner animation="border" size="sm" />
              <span className="ms-3">Sending...</span>
            </>
          ) : (
            'Re Send'
          )}
        </Button>
      </Form>

      <Modal show={showModal} centered>
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
