import { load } from '@fingerprintjs/fingerprintjs'

let cachedDeviceId: string | undefined
const DEVICE_ID_KEY = 'device_id'

export const getDeviceId = (): string => {
  if (!cachedDeviceId) {
    cachedDeviceId = localStorage.getItem(DEVICE_ID_KEY) || ''
  }
  return cachedDeviceId
}

export const initDeviceId = async (): Promise<void> => {
  if (cachedDeviceId) return
  const fp = await load()
  const result = await fp.get()
  cachedDeviceId = result.visitorId
  localStorage.setItem(DEVICE_ID_KEY, cachedDeviceId)
}
