'use client';
import React from 'react';
import { LayoutDashboard, BookCheck } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

import './globals.css';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const router = useRouter();
	const pathname = usePathname();
	return (
		<html lang='en'>
			<body>
				<div className='bg-[#09090B] w-full h-full fixed top-0 left-0 flex flex-row justify-center align-center'>
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
								<LayoutDashboard />
								<div>الرئيسية</div>
							</div>
							<div className={`page-button${pathname == '/main/exams' ? ' selected' : ''}`} onClick={() => router.push('/main/exams')}>
								<BookCheck />
								<div>اختباراتي</div>
							</div>
						</div>
					</div>
				</div>
			</body>
		</html>
	);
}
