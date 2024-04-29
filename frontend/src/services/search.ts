import { API_HOST } from '../config'
import { type Data } from '../types'

export type ApiSearchResponse = {
  message: string
  data: Data
}

export const searchData = async (search: string): Promise<[Error?, Data?]> => {
  try {
    const res = await fetch(`${API_HOST}/api/users?q=${search}`)

    if (!res.ok)
      return [new Error(`Error searching data: ${(await res).statusText}`)]

    const json = (await res.json()) as ApiSearchResponse
    return [undefined, json.data]
  } catch (e) {
    if (e instanceof Error) return [e]
  }
  return [new Error('Unknown error')]
}
