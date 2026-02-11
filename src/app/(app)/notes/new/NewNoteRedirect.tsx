'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createNote } from '../actions'

export default function NewNoteRedirect() {
  const router = useRouter()

  useEffect(() => {
    createNote().then((note) => {
      router.replace(`/notes/${note.id}`)
    })
  }, [router])

  return null
}
