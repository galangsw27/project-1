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
      <CardHeader>Testing</CardHeader>
      <CardBody>
        <div className="mb-3 text-end">
          <Button variant="success">
            <FontAwesomeIcon icon={faPlus} fixedWidth />
            Add New
          </Button>
        </div>
        <Table striped>
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Username</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
              <td>
                <Dropdown align="end">
                  <DropdownToggle
                    as="button"
                    bsPrefix="btn"
                    className="btn-link rounded-0 text-black-50 dark:text-gray-500 shadow-none p-0"
                    id="action-user4"
                  >
                    <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem href="#/action-1">info</DropdownItem>
                    <DropdownItem href="#/action-2">edit</DropdownItem>
                    <DropdownItem className="text-danger" href="#/action-3">
                      delete
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </td>
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
