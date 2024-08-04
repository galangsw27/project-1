// 'use client'
import { Button, DropdownToggle, Table, Dropdown, DropdownItem, DropdownMenu, Card , CardHeader, CardBody } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { faEllipsisVertical, faPlus } from '@fortawesome/free-solid-svg-icons'
import { getDictionary } from '@/locales/dictionary'

export default function Index() {
  const dict = getDictionary()

  if (!dict) {
    return <div>Loading...</div>
  }

  return (
    <Card>
      <CardHeader>Blast History</CardHeader>
      <CardBody>
       
        <Table striped>
          <thead>
            <tr>
              <th>#</th>
              <th>Session Name</th>
              <th>Status</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <td>3</td>
              <td colSpan={2}>Larry the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </Table>
      </CardBody>
    </Card>
  )
}
