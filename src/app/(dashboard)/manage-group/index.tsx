import { Button, DropdownToggle, Table, Dropdown, DropdownItem, DropdownMenu, Card , CardHeader, CardBody } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';
import { faEllipsisVertical, faPlus } from '@fortawesome/free-solid-svg-icons';
import { getDictionary } from '@/locales/dictionary';

export default function Index() {
  const [dict, setDict] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const dictionary = await getDictionary();
      setDict(dictionary);
    }
    fetchData();
  }, []);

  if (!dict) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>{dict.pokemons.title}</CardHeader>
      <CardBody>
        <div className="mb-3 text-end">
          <Button variant="success">
            <FontAwesomeIcon icon={faPlus} fixedWidth />
            {dict.pokemons.add_new}
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
                    <DropdownItem href="#/action-1">{dict.action.info}</DropdownItem>
                    <DropdownItem href="#/action-2">{dict.action.edit}</DropdownItem>
                    <DropdownItem className="text-danger" href="#/action-3">
                      {dict.action.delete}
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
  );
}
