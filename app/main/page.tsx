'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Hexagon, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import badges from '../badges.json';
import './page.css';

import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';

function Section(props: any) {
	return (
		<div className={props.className} id={props.id}>
			<div className='text-[50px]'>{props.title}</div>
			<div className='bg-white w-full h-[1px] my-2'>&nbsp;</div>
			<div>{props.children}</div>
		</div>
	);
}

export default function Home() {
	const [state, setState] = useState<any>({
		exams: [],
		badges: [],
		showingBadge: -1,
	});

	const searchParams = useSearchParams();
	const sections: any = useRef(null);

	useEffect(() => {
		let exams = JSON.parse(localStorage.getItem('exams') || '[]');
		let unlockedBadges = JSON.parse(localStorage.getItem('badges') || '[]');
		let userBadges = [...badges];
		userBadges = userBadges.map((badge) => {
			return {
				...badge,
				locked: !unlockedBadges.includes(badge.id),
			};
		});

		setState({
			...state,
			exams: exams,
			badges: userBadges,
		});

		let scrollTo = searchParams.get('to');
		if (scrollTo) {
			let element: any = document.querySelector(`#${scrollTo}`);
			let top = element.getBoundingClientRect().top;

			console.log(top);
			setTimeout(() => {
				sections.current.scrollTop = top;
			}, 100);
		}
	}, []);
	// badges.find((e) => e.id == state.showingBadge).name}
	return (
		<div className='w-full h-full overflow-y-scroll relative inline-block' ref={sections}>
			{state.showingBadge != -1 && (
				<div className='fixed w-full h-full bg-[rgba(0,0,0,0.5)] z-10 top-0 left-0 flex justify-center items-center'>
					<div className='bg-[#2E3856] z-20 rounded-xl p-4 py-2 relative'>
						<div className='absolute top-0 left-0 mt-3 ml-3  text-red-600' onClick={() => setState({ ...state, showingBadge: -1 })}>
							<X className='w-[30px] h-[30px]' />
						</div>

						<div className='text-[30px]'>{(badges.find((e: any) => e.id == state.showingBadge) || { name: '' }).name}</div>
						<div className='text-[20px] text-gray-400'>{(badges.find((e: any) => e.id == state.showingBadge) || { description: '' }).description}</div>
					</div>
				</div>
			)}

			{state.exams.length != 0 ? (
				<Section title='أحدث الإختبارات' className='mt-2 p-4'>
					<div className='flex flex-row content-start flex-wrap gap-8 p-4 gap-x-11 items-center h-[275px]  bg-[#2E3856] rounded mt-4'>
						{state.exams
							.filter((e: any) => !e.pending)
							.sort((a: any, b: any) => b.date - a.date)
							.slice(0, 21)
							.map((exam: any, index: number) => {
								console.log(exam);
								return (
									<div key={index.toString()} className='rounded border-gray-200 border-2 p-4 px-8 h-min w-min flex flex-row justify-center items-center'>
										<div className='whitespace-nowrap'>{exam.name}</div>&nbsp;-&nbsp;
										<div>{((exam.data.filter((question: any) => question.true == question.chosen).length / exam.data.length) * 100).toFixed(2)}%</div>
									</div>
								);
							})}
					</div>

					<div className='flex items-center justify-center p-4 bg-[#2E3856] rounded mt-4'>
						<LineChart
							width={1000}
							height={300}
							data={state.exams
								.filter((e: any) => !e.pending)
								.sort((a: any, b: any) => a.date - b.date)
								.map((exam: any) => {
									return {
										uv: (exam.data.filter((question: any) => question.true == question.chosen).length / exam.data.length) * 100,
									};
								})}
							className=''
						>
							<Line type='monotone' dataKey='uv' stroke='#8884d8' strokeWidth={3} />
							<CartesianGrid stroke='rgba(255, 255, 255, 0.3)' />
							<YAxis tickMargin={35} domain={[0, 100]} />
						</LineChart>
					</div>
				</Section>
			) : (
				<Section title='أحدث الإختبارات' className='mt-2 p-4'>
					<div className='text-[30px] flex justify-center items-center pt-4'>لا توجد أي إختبارات</div>
				</Section>
			)}
			<Section id='badges' title={`الإنجازات (${state.badges.filter((item: any) => !item.locked).length})`} className='p-4'>
				<div className='flex flex-row content-start flex-wrap gap-8 p-6 gap-x-12 items-center bg-[#2E3856] rounded mt-4'>
					{state.badges.map((badge: any, index: number) => {
						console.log(badge);
						return (
							<div
								key={index.toString()}
								className='w-min h-min rounded-b-lg rounded-t-full pt-1 badge'
								style={{
									backgroundColor: badge.locked ? '#D9DDE8' : 'rgb(61, 61, 130)',
									opacity: badge.locked ? 0.5 : 1,
								}}
								onClick={() => setState({ ...state, showingBadge: badge.id })}
							>
								<Hexagon className='w-[128px] h-[128px] p-2' />
								<div
									className='text-center w-full my-2 text-[20px]'
									style={{
										color: badge.locked ? 'black' : 'white',
									}}
								>
									{badge.name}
								</div>
							</div>
						);
					})}
				</div>
			</Section>
		</div>
	);
}
