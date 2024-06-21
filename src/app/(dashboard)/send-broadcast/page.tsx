import React from 'react'
import { newResource, ResourceCollection } from '@/models/resource'
import { Pokemon } from '@/models/pokemon'
import { SearchParams } from '@/types/next'
import Index from '@/app/(dashboard)/send-broadcast/index'
import serverFetch from '@/utils/server-fetch'
import { getLocale } from '@/locales/dictionary'

const fetchPokemons = async () => {
  
}
export default async function Page() {
  const props = await fetchPokemons()

  
  return (
    <Index />
  )
}

