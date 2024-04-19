import React from 'react';
import './globals.css';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
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
