// utils/fetchQr.ts
export const fetchQr = async () => {
  try {
    const response = await fetch('https://localhost/api/qrcode') // replace with your actual API endpoint
    if (!response.ok) {
      throw new Error(`Network response was not ok ${  response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch QR code data:', error)
    return null
  }
}
