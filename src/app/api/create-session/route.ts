// app/api/create-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(req: NextRequest) {
  const { nameSession } = await req.json(); // Mengambil data dari body permintaan

  try {
    const response = await fetch(`${baseURL}/start-session?session=${nameSession}&scan=true`);
    // console.log(response)
    if (!response.ok) {
      throw new Error(`Network response was not ok ${response.statusText}`);
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const scriptContent = dom.window.document.querySelector("script")?.textContent;
    const base64Pattern = /data:image\/png;base64,[^')]+/;
    const match = base64Pattern.exec(scriptContent ?? "") ;
    const qrImage = match ? match[0] : null;

    if (qrImage) {
      return NextResponse.json({ qrImage });
    } else {
      return NextResponse.json({ message: "No image source found" }, { status: 404 });
    }
  } catch (error) {
    console.error('Failed to fetch QR code data:', error);
    return NextResponse.json({ error: 'Failed to fetch QR code data' }, { status: 500 });
  }
}
