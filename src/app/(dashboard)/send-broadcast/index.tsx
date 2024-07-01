'use client'

import { Button, Card, Form, Table, Modal } from 'react-bootstrap'
import React, { useState, useEffect } from 'react'
import groupsData from './group.json' // Import the JSON file
import qrData from '../qrcode/qrData.json' // Import the JSON file

interface Group {
  value: string;
  label: string;
  nomor?: {
    [key: string]: string;
  };
}


interface GroupsData {
  groups: Group[];
}

export default function Index() {
  const [selectedGroup, setSelectedGroup] = useState<string>('')
  const [options, setOptions] = useState<Group[]>([])
  const [nomor, setNomor] = useState<{ [key: string]: string }>({})

  const [showMore, setShowMore] = useState(false)

  const handleShowMore = () => setShowMore(true)
  const handleClose = () => setShowMore(false)

  
  useEffect(() => {
    const data: GroupsData = groupsData as GroupsData
    setOptions(data.groups) // Set the options from the imported JSON data
  }, [])

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value
    setSelectedGroup(selectedValue)

    // Find the selected group and update the nomor state
    const selectedGroup = options.find(option => option.value === selectedValue)
    if (selectedGroup && selectedGroup.nomor) {
      setNomor(selectedGroup.nomor) // Set the nomor values if they exist
    } else {
      setNomor({})
    }
  }

  return (
    <Card>
      <Card.Header>Send Broadcast</Card.Header>
      <Card.Body>
        <div className="mb-3">
        <Form.Label> Sender
        </Form.Label>
          <Form.Control
            type="text"
            id="sender"
            value={qrData.name}
            disabled
          />
          <Form.Label> Sender Number
        </Form.Label>
          <Form.Control
            type="text"
            id="number"
            value={qrData.number}
            disabled
          />
          <Form.Label> Group
          </Form.Label>
          <Form.Select value={selectedGroup} onChange={handleSelectChange}>
            <option>Select Group</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
          <div className="pt-2" style={{ display: 'flex' }}>
          <div>
      {Object.keys(nomor).length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nomor yang akan dikirim</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(nomor).slice(0, 5).map(([key, value]) => (
              <tr key={key}>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      
      {Object.keys(nomor).length > 5 && (
        <Button variant="outline-dark"  onClick={handleShowMore}>
          Show More
        </Button>
      )}

      <Modal show={showMore} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Nomor yang akan dikirim</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nomor yang akan dikirim</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(nomor).map(([key, value]) => (
                <tr key={key}>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>

          </div>

        </div>
        <div className="pt-2" style={{ display: 'flex' }}>

        <Button variant="info" style={{ marginLeft: 'auto', color: 'white' }}>Send</Button>
</div>
      </Card.Body>
    </Card>
  )
}
