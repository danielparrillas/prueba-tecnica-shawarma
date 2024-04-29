import React, { useEffect, useState } from 'react'
import { Data } from '../types'
import { searchData } from '../services/search'
import { toast } from 'sonner'
import { useDebounce } from '@uidotdev/usehooks'

const DEBOUNCE_TIME = 300
export const Search: React.FC<{ initialData: Data }> = ({ initialData }) => {
  const [data, setData] = useState<Data>(initialData)
  const [search, setSearch] = useState<string>(() => {
    const searchParams = new URLSearchParams(window.location.search)
    return searchParams.get('q') ?? ''
  })
  const debounceSearch = useDebounce(search, DEBOUNCE_TIME)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  useEffect(() => {
    const newPathname =
      debounceSearch === '' ? window.location.pathname : `?q=${debounceSearch}`

    window.history.pushState({}, '', newPathname)
  }, [debounceSearch])

  useEffect(() => {
    if (!debounceSearch) {
      setData(initialData)
      return
    }
    searchData(debounceSearch).then(([err, newData]) => {
      if (err) {
        toast.error(err.message)
        return
      }
      if (newData && newData.length > 0) {
        setData(newData)
        toast.success('Datos recuperados')
        return
      }
      toast.warning('No se encontro ningún dato')
    })
  }, [debounceSearch, initialData])

  return (
    <section>
      <h1>Search</h1>
      <form action="">
        <input
          type="search"
          placeholder="Buscar información"
          onChange={handleSearch}
          value={search}
        />
      </form>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            <article>
              {Object.entries(item).map(([key, value]) => (
                <p key={key}>
                  <strong>{key}: </strong>
                  {value}
                </p>
              ))}
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Search
