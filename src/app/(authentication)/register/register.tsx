'use client'

import {
  Alert, Button, Form, FormControl, InputGroup,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faUser } from '@fortawesome/free-regular-svg-icons'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import InputGroupText from 'react-bootstrap/InputGroupText'
import useDictionary from '@/locales/dictionary-hook'

export default function Register() {
  const router = useRouter()
  const dict = useDictionary()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const register = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    const formData = new FormData(event.target as HTMLFormElement)

    if (formData.get('password') !== formData.get('password_repeat')) {
      setError('Passwords do not match')
      setSubmitting(false)
      return
    }

    try {
      const res = await fetch('http://localhost:5001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password'),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Register failed')
        return
      }

      // Assuming the API does not return a URL for redirection, but just a success message
      router.push('/login')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Alert variant="danger" show={error !== ''} onClose={() => setError('')} dismissible>{error}</Alert>
      <Form onSubmit={register}>
        <InputGroup className="mb-3">
          <InputGroupText><FontAwesomeIcon icon={faUser} fixedWidth /></InputGroupText>
          <FormControl
            name="username"
            required
            disabled={submitting}
            placeholder={dict.signup.form.username}
            aria-label="Username"
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroupText>
            <FontAwesomeIcon icon={faEnvelope} fixedWidth />
          </InputGroupText>
          <FormControl
            type="email"
            name="email"
            required
            disabled={submitting}
            placeholder={dict.signup.form.email}
            aria-label="Email"
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroupText><FontAwesomeIcon icon={faLock} fixedWidth /></InputGroupText>
          <FormControl
            type="password"
            name="password"
            required
            disabled={submitting}
            placeholder={dict.signup.form.password}
            aria-label="Password"
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroupText><FontAwesomeIcon icon={faLock} fixedWidth /></InputGroupText>
          <FormControl
            type="password"
            name="password_repeat"
            required
            disabled={submitting}
            placeholder={dict.signup.form.confirm_password}
            aria-label="Confirm password"
          />
        </InputGroup>

        <Button type="submit" className="d-block w-100" disabled={submitting} variant="success">
          {dict.signup.form.submit}
        </Button>
      </Form>
    </>
  )
}
