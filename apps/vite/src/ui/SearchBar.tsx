import { useNavigate } from 'react-router-dom'
import { Group, Button } from '@ui8kit/core'
import { useState } from 'react'

export function SearchBar({ initial = '' }: { initial?: string }) {
  const [q, setQ] = useState(initial)
  const nav = useNavigate()
  const go = () => nav(`/search?q=${encodeURIComponent(q)}`)
  return (
    <Group gap="sm" align="center">
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') go() }}
        placeholder="Search..."
        aria-label="Search"
        data-class="search-input"
      />
      <Button size="sm" onClick={go}>Search</Button>
    </Group>
  )
}


