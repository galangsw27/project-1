'use client'

import { Button, Card, } from 'react-bootstrap'
import React from 'react'
import { newResource, ResourceCollection } from '@/models/resource'
import { Pokemon } from '@/models/pokemon'
import Pagination from '@/components/Pagination/Pagination'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import useSWR from 'swr'
import PokemonList from '@/components/Page/Pokemon/PokemonList'
import Cookies from 'js-cookie'
import useDictionary from '@/locales/dictionary-hook'

export default function Index() {
  
  return (
    <Card>
      <Card.Header>Send Broadcast</Card.Header>
      <Card.Body>
        <div className="mb-3">
        <label htmlFor="formFile" className="form-label">Default file input example</label>
        <input className="form-control" type="file" id="formFile" />
        </div>
      </Card.Body>
    </Card>
  )
}
 