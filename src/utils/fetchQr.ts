// utils/fetchQr.ts
export const fetchQr = async () => {
  try {
    const response = await fetch('http://localhost:5001/start-session?session=mysession&scan=true') // replace with your actual API endpoint
    if (!response.ok) {
      throw new Error(`Network response was not ok ${  response.statusText}`)
    }
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const imgElement = doc.querySelector('img');
    if (imgElement && imgElement.src) {
      return imgElement.src;
    }
    throw new Error('No image found in the response');
  } catch (error) {
    console.error('Failed to fetch QR code data:', error);
    return null;
  }
};
