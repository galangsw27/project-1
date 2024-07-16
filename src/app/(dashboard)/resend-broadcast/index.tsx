'use client';

import { Key, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { useRouter } from 'next/navigation';
import { Form, Button, Container, Col, Row, Modal, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;


interface IndexPageProps {
  nameSession: any; // Specify the type of nameSession
}

const IndexPage: React.FC<IndexPageProps> = ({ nameSession }) => {  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [textValue, setTextValue] = useState<string>('');
  const [loadingReSend, setLoadingReSend] = useState(false);

  const [selectedSession, setSelectedSession] = useState(nameSession.length > 0 ? nameSession[0] : '');
  const router = useRouter();


  

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSession) {
      alert('Please select a session');
      return;
    }

    if ( !textValue || !imageFile) {
      alert('Please fill in all fields');
      return;
    }


    setLoadingReSend(true);

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

      formData.append('session', selectedSession);
      let randomString = generateRandomString(5); 
      formData.append('editedMessage', textValue+`\n`+ randomString);
      formData.append('image', imageFile);

      const response = await axios.post(`${baseURL}/resend-all-messages`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });


      console.log('Response:', response.data);
      const totalFail = response.data.data.failureCount;
      const totalSuccess = response.data.data.successCount;

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
      <Form onSubmit={handleResend}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="sessionSelect">
              <Form.Label>Select Session:</Form.Label>
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
        <br/>
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
        <Button variant="success" onClick={handleResend} disabled={loadingReSend}>
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

     
    </Container>
  );
};

export default IndexPage;
