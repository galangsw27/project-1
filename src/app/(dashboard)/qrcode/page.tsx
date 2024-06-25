// app/page.tsx
import React from 'react';
import Index from '@/app/(dashboard)/qrcode/index';
import { fetchQr } from '@/utils/fetchQr';



export default async function Page() {
  const qrData = await fetchQr();

 return (
    <Index qrData={qrData} />
  )
}
// const Page = async () => {
//   const qrData = await fetchQr();
//   return <Index qrData={qrData} />;
// 

// export default Page;
