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
					<div id='main' className='w-full'>
						{children}
					</div>
				</div>
			</body>
		</html>
	);
}
