import { API_HOST } from '../config'
import { Data } from '../types'

export type ApiUploadResponse = {
  message: string
  data: Data
}

export const uploadFile = async (file: File): Promise<[Error?, Data?]> => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const res = await fetch(`${API_HOST}/api/files`, {
      method: 'POST',
      body: formData
    })

    if (!res.ok)
      return [new Error(`Error uploading file: ${(await res).statusText}`)]

    const json = (await res.json()) as ApiUploadResponse
    return [undefined, json.data]
  } catch (e) {
    if (e instanceof Error) return [e]
  }
  return [new Error('Unknown error')]
}
