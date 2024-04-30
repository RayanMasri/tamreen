'use client';
import React, { useState, useEffect, useRef } from 'react';
import { BookOpenCheck, Timer, CirclePlus, Trash2, Pencil, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import data from '../../data.json';
import './page.css';

import useMediaQuery from '../../../hooks/media-hook';

const skills: any = {
	'verbal-analogy': 'تناظر لفظي',
	'contextual-error': 'خطأ سياقي',
	'sentence-completion': 'إكمال جمل',
};
function Question(props: any) {
	let mobile = useMediaQuery('only screen and (max-width: 1212px)');

	return (
		<div
			className={
				mobile
					? 'rounded relative border-gray-200 border-[1px] pb-2 pt-2 px-2 min-w-[100px] flex flex-col justify-center items-center'
					: 'rounded relative border-gray-200 border-2 pb-4 pt-2 px-4 min-w-[400px] flex flex-col justify-center items-center'
			}
		>
			<div id='title' className={mobile ? 'text-[18px] flex flex-row justify-between items-start gap-2 w-full' : 'text-[30px] flex flex-row justify-between items-center gap-2 w-full'}>
				<div className='flex flex-row justify-center items-center gap-2'>{props.data.question}</div>
				<div className='flex flex-row gap-x-2'>
					<Trash2 className={mobile ? 'w-[18px] h-[18px] text-red-400 basic-hover mt-1' : 'text-red-400 basic-hover'} onClick={props.onDelete} />
				</div>
			</div>
			<div className='flex flex-row justify-start items-start flex-wrap gap-2 p-2 pb-0 pr-0 w-full'>
				{props.data.answers.map((answer: any, index: number) => {
					return (
						<div
							key={`${props.data.question}-${index.toString()}`}
							className={
								mobile
									? 'rounded-full text-black text-[12px] px-2 whitespace-nowrap flex flex-row justify-center items-center gap-x-1 '
									: 'rounded-full text-black p-1 px-3 whitespace-nowrap flex flex-row justify-center items-center gap-x-1 '
							}
							style={{
								backgroundColor: answer == props.data.true ? 'green' : 'white',
								color: answer == props.data.true ? 'white' : 'black',
							}}
						>
							{answer == props.data.true && <Check className={mobile && 'w-[16px] h-[16px]'} />}
							<div>{answer}</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default function Exams() {
	const router = useRouter();
	const [state, setState] = useState<any>({
		marked: [],
	});

	useEffect(() => {
		let marked = JSON.parse(localStorage.getItem('marked') || '[]');

		let questions = Object.values(data).flat();
		console.log(marked);
		marked = marked.map((e: any) => {
			let question = questions.find((item) => item.id == e.id) || {};

			return {
				...e,
				question: question,
			};
		});

		setState({
			...state,
			marked: marked,
		});
	}, []);

	const onDelete = (id: any) => {
		let marked = [...state.marked];

		marked = marked.filter((e: any) => e.id != id);

		localStorage.setItem('marked', JSON.stringify(marked));

		setState({
			...state,
			marked: marked,
		});
	};

	return (
		<div className='relative w-full h-full'>
			<div className='w-full h-full flex flex-row flex-wrap content-start gap-8 p-8 overflow-y-scroll relative pb-20'>
				{state.marked
					.sort((a: any, b: any) => b.date - a.date)
					.map((question: any, index: number) => {
						console.log(question);
						return <Question data={question.question} key={`question-${index}`} onDelete={() => onDelete(question.id)} />;
					})}
			</div>
		</div>
	);
}
