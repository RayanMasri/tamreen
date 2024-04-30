'use client';
import React, { useEffect, useState } from 'react';
import { Home, Bookmark, BookCheck, Award, Info, ChevronLeft } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import useMediaQuery from '../../hooks/media-hook';

import './globals.css';

function Desktop() {
	const router = useRouter();
	const pathname = usePathname();
	const params = useSearchParams();

	return (
		<div id='menu' className='h-full w-[300px] border-[#797979] border-l-2'>
			<div id='title' className='flex flex-col justify-center items-start text-right w-full p-2'>
				<div className='mb-1'>
					<div></div>
					<div className='text-[40px]'>تمرين</div>
				</div>
				<div className='text-gray-300'>برنامج لتطوير مهاراتك في إختبار القدرات</div>
			</div>
			<div id='pages' className='mt-8 w-full'>
				<div className={`page-button${pathname == '/main' ? ' selected' : ''}`} onClick={() => router.push('/main')}>
					<Home />
					<div style={{ color: 'white' }}>الرئيسية</div>
				</div>
				<div className={`page-button${pathname == '/main/exams' ? ' selected' : ''}`} onClick={() => router.push('/main/exams')}>
					<BookCheck />
					<div style={{ color: 'white' }}>اختباراتي</div>
				</div>

				<div
					className={`page-button${pathname == '/main' ? ' selected' : ''}`}
					onClick={() => {
						if (pathname == '/main') {
							setTimeout(function () {
								window.location.reload();
							}, 100);
						}
						router.push('/main?to=badges');
					}}
				>
					<Award />
					<div style={{ color: 'white' }}>الانجازات</div>
				</div>
				<div
					className={`page-button${pathname == '/main/marked' ? ' selected' : ''}`}
					onClick={() => {
						router.push('/main/marked');
					}}
				>
					<Bookmark />
					<div>أسئلة محفوظة</div>
				</div>
				<div className='w-full h-[1px] bg-white my-4'>&nbsp;</div>
				<div
					className={`page-button${pathname == '/main/about/' ? ' selected' : ''}`}
					onClick={() => {
						router.push('/main/about');
					}}
				>
					<Info />
					<div>حولنا</div>
				</div>
			</div>
		</div>
	);
}

function Mobile() {
	const router = useRouter();
	const pathname = usePathname();

	return (
		<div id='menu' className='h-full w-min p-2 border-[#797979] border-l-2'>
			<div id='title' className='flex flex-col justify-center items-center text-right w-full p-2'>
				<div className='mb-4 w-full'>
					<div className='text-[30px] w-full text-center'>تمرين</div>
				</div>
				{/* <div className='circle-button'>
					<ChevronLeft />
				</div> */}
			</div>
			<div className='w-full gap-y-2 flex flex-col justify-between items-center h-[610px]'>
				<div className='py-2 flex flex-col gap-y-4'>
					<div className='circle-button' onClick={() => router.push('/main')}>
						<Home />
					</div>
					<div className='circle-button' onClick={() => router.push('/main/exams')}>
						<BookCheck />
					</div>
					<div
						className='circle-button'
						onClick={() => {
							if (pathname == '/main') {
								setTimeout(function () {
									window.location.reload();
								}, 100);
							}
							router.push('/main?to=badges');
						}}
					>
						<Award />
					</div>
					<div
						className='circle-button'
						onClick={() => {
							router.push('/main/marked');
						}}
					>
						<Bookmark />
					</div>
				</div>
				<div className='h-min w-full flex justify-center items-center flex-col'>
					{/* <div className='w-full h-[1px] bg-white my-4'>&nbsp;</div> */}
					<div
						className='circle-button'
						onClick={() => {
							router.push('/main/about');
						}}
					>
						<Info />
					</div>
				</div>
			</div>
		</div>
	);
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	let mobile = useMediaQuery('only screen and (max-width: 1212px)');
	//
	return (
		<html lang='en'>
			<body>
				<div className='bg-[#09090B] w-full h-full fixed top-0 left-0 flex flex-row justify-start align-center box-border'>
					{mobile ? <Mobile /> : <Desktop />}
					<div
						className='h-full box-border'
						style={{
							width: 'calc(100% - 100px)',
						}}
					>
						{children}
					</div>
				</div>
			</body>
		</html>
	);
}
