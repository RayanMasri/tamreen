'use client';
import React, { useState, useEffect, useRef } from 'react';
import { BookOpenCheck, Timer, CirclePlus, Trash2, Pencil, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import data from '../../data.json';
import './page.css';

const formatSeconds = (seconds: number) => {
	seconds = seconds / 1000;
	seconds = Math.round(seconds);
	var hours = Math.floor(seconds / (60 * 60));

	var divisor_for_minutes = seconds % (60 * 60);
	var minutes = Math.floor(divisor_for_minutes / 60);

	var divisor_for_seconds = divisor_for_minutes % 60;
	seconds = Math.ceil(divisor_for_seconds);
	console.log(hours);
	return `${hours != 0 ? hours.toString() + 'h ' : ''}${minutes != 0 ? minutes.toString() + 'm ' : ''}${seconds != 0 ? seconds.toString() + 's ' : ''}`;
};

const skills: any = {
	'verbal-analogy': 'تناظر لفظي',
	'contextual-error': 'خطأ سياقي',
	'sentence-completion': 'إكمال جمل',
};
function Question(props: any) {
	return (
		<div className='rounded relative border-gray-200 border-2 pb-4 pt-2 px-4 min-w-[400px] flex flex-col justify-center items-center'>
			<div id='title' className='text-[30px] flex flex-row justify-between items-center gap-2 w-full'>
				<div className='flex flex-row justify-center items-center gap-2'>{props.data.question}</div>
				<div className=' flex flex-row gap-x-2'>
					<Trash2 className='text-red-400 basic-hover' onClick={props.onDelete} />
				</div>
			</div>
			<div className='flex flex-row justify-start items-start gap-x-2 p-2 pb-0 pr-0 w-full'>
				{props.data.answers.map((answer: any, index: number) => {
					return (
						<div
							key={`${props.data.question}-${index.toString()}`}
							className='rounded-full text-black p-1 px-3 whitespace-nowrap flex flex-row justify-center items-center gap-x-1 '
							style={{
								backgroundColor: answer == props.data.true ? 'green' : 'white',
								color: answer == props.data.true ? 'white' : 'black',
							}}
						>
							{answer == props.data.true && <Check />}
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
