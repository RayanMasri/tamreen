'use client';
import React, { useState, useEffect } from 'react';
import { BookOpenCheck, Timer } from 'lucide-react';
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
function Exam(props: { exam: any }) {
	let values: any = {
		'verbal-analogy': 0,
		'contextual-error': 0,
		'sentence-completion': 0,
	};

	props.exam.data.map((question: any) => {
		values[question.skill] += 1;
	});

	let description: any = [];

	for (let [key, value] of Object.entries(values)) {
		description.push(`${value} ${skills[key]}`);
	}

	description = description.join(' - ');

	return (
		<div className='rounded border-gray-200 border-2 p-4 h-min w-[370px]'>
			<div id='title' className='text-[30px]'>
				اختبار {props.exam.id}
			</div>
			<div id='description' className='text-gray-300'>
				{description}
			</div>

			<div className='mt-8 flex flex-row gap-4'>
				<div className='flex flex-row gap-1 justify-center items-center h-min'>
					<BookOpenCheck />
					<div className='text-[14px] text-gray-400'>
						{props.exam.data.filter((item: any) => item.chosen == item.true).length}/{props.exam.data.length}
					</div>
				</div>
				<div className='flex flex-row gap-1 justify-center items-center h-min'>
					<Timer />
					<div className='text-[14px] text-gray-400'>{formatSeconds(props.exam.duration)}</div>
				</div>
			</div>
		</div>
	);
}

function shuffle(array: any[]) {
	let currentIndex = array.length;

	// While there remain elements to shuffle...
	while (currentIndex != 0) {
		// Pick a remaining element...
		let randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}
}

export default function Exams() {
	const router = useRouter();
	const [state, setState] = useState({
		exams: [],
	});

	useEffect(() => {
		let exams = JSON.parse(localStorage.getItem('exams') || '[]');
		setState({
			...state,
			exams: exams,
		});
	}, []);

	const newExam = () => {
		let questions: any = [];

		for (let [key, value] of Object.entries(data)) {
			shuffle(value);

			questions.push(
				value.slice(0, 10).map((question: any) => {
					return {
						...question,
						skill: key,
						chosen: '',
					};
				})
			);
		}

		questions = questions.flat();
		console.log(questions);
		localStorage.setItem('exam', JSON.stringify(questions));

		router.push('/take-exam');
	};

	return (
		<div className='relative w-full h-full'>
			<div className='w-full h-full flex flex-row flex-wrap content-start gap-8 p-8 overflow-y-scroll relative'>
				{state.exams.map((exam: any, index: number) => {
					return <Exam exam={exam} key={`exam-${index}`} />;
				})}
			</div>
			<div id='new-exam' className='absolute bottom-0 left-0 w-full p-2 text-[25px] flex justify-center items-center text-center' onClick={() => newExam()}>
				اختبار جديد
			</div>
		</div>
	);
}
