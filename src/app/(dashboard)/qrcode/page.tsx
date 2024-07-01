// app/page.tsx
import React from 'react';
import Index from '@/app/(dashboard)/qrcode/index';
// import { fetchQr } from '@/utils/fetchQr';
// import { number } from 'zod';



export default async function Page() {
  // const qrData = await fetchQr();
  const qrData = await fetchQrDummy();


 return (
    <Index qrData={qrData} />
  )
}

async function fetchQrDummy() {
  // Simulasi data yang diambil dari API atau sumber data lainnya
  return {
    qrCode: "/assets/img/active.png",
    nama: "John Doe",
    number: "+6271927192",
    status: true,
    device: "1",
    // Anda bisa menambahkan lebih banyak properti sesuai kebutuhan
    // Contoh:
    // age: 30,
    // address: "123 Main St, Cityville",
  };
}
// const Page = async () => {
//   const qrData = await fetchQr();
//   return <Index qrData={qrData} />;
// 

// export default Page;
