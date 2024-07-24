'use client'

import {
  Alert, Button, Col, Form, FormControl, InputGroup, Row, Spinner,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import InputGroupText from 'react-bootstrap/InputGroupText'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import useDictionary from '@/locales/dictionary-hook'


export default function Login({ callbackUrl }: { callbackUrl: string }) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const dict = useDictionary()

  const login = async (formData: FormData) => {
    setSubmitting(true)

    try {
      const res = await signIn('credentials', {
        email: formData.get('username'),
        password: formData.get('password'),
        redirect: false,
        callbackUrl,
      })

      if (!res) {
        setError('Login failed')
        return
      }

      const { ok, url, error: err } = res

      if (!ok) {
        if (err) {
          setError(err)
          return
        }

        setError('Login failed')
        return
      }

      if (url) {
        // localStorage.setItem('token',)
        router.push(url)
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const [isHover, setIsHover] = useState(false);
  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseLeave = () => {
      setIsHover(false);
  };

  const boxStyle = {
    width: "100%",
    border: "none",
    backgroundImage: isHover ? 'none' : 'linear-gradient(to left, #2c3e50, #3498db)',
    backgroundColor: isHover ? '#2c3e50' : 'transparent',
  };

  return (
    <>
      {submitting && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          zIndex: 9999,
        }}>
          <Spinner animation="border" variant="primary" />
        </div>
      )}
      <Alert
        variant="danger"
        show={error !== ''}
        onClose={() => setError('')}
        dismissible
      >
        {error}
      </Alert>
      <Form onSubmit={(e) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        login(formData)
      }}>
        <InputGroup className="mb-3">
          <InputGroupText>
            <FontAwesomeIcon
              icon={faUser}
              fixedWidth
            />
          </InputGroupText>
          <FormControl
            name="username"
            required
            type='email'
            disabled={submitting}
            placeholder={dict.login.form.username}
            aria-label="Email"
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroupText>
            <FontAwesomeIcon
              icon={faLock}
              fixedWidth
            />
          </InputGroupText>
          <FormControl
            type="password"
            name="password"
            required
            disabled={submitting}
            placeholder={dict.login.form.password}
            aria-label="Password"
          />
        </InputGroup>

        <Row className="align-items-center">
          <Col>
            <Button
              style={boxStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="px-4"
              type="submit"
              disabled={submitting}
            >
              {dict.login.form.submit}
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  )
}
