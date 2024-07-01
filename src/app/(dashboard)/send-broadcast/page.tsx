import React from 'react'
import Index from '@/app/(dashboard)/send-broadcast/index'

const fetchPokemons = async () => {
  
}
export default async function Page() {
  const props = await fetchPokemons()

  
  return (
    <Index />
  )
}

