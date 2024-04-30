'use client';
import React, { useState, useEffect, useRef } from 'react';
import { BookOpenCheck, Timer, CirclePlus, Trash2, Pencil, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import data from '../../data.json';
import './page.css';

import useMediaQuery from '../../../hooks/media-hook';

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
	const [state, setState] = useState<any>({
		deleted: false,
		name: props.exam.name,
	});

	const router = useRouter();
	const name: any = useRef();

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
		if (value != 0) {
			description.push(`${value} ${skills[key]}`);
		}
	}

	description = description.join(' - ');

	const onChange = (event: any) => {
		setState({
			...state,
			name: event.target.value,
		});

		if (event.target.value.trim() != '') {
			let exams = JSON.parse(localStorage.getItem('exams') || '[]');
			exams = exams.map((exam: any) => {
				if (exam.id != props.exam.id) return exam;

				return {
					...exam,
					name: event.target.value.trim(),
				};
			});

			localStorage.setItem('exams', JSON.stringify(exams));
		}
	};

	const onDelete = () => {
		let exams = JSON.parse(localStorage.getItem('exams') || '[]');
		exams = exams.filter((exam: any) => exam.id != props.exam.id);
		localStorage.setItem('exams', JSON.stringify(exams));

		setState({
			...state,
			deleted: true,
		});
	};

	const onEdit = () => {
		name.current.focus();
		name.current.select();
	};

	let mobile = useMediaQuery('only screen and (max-width: 1212px)');

	return (
		<div
			className={mobile ? 'rounded relative border-gray-200 border-[1px] p-2 pt-1 w-[194px] h-[110px] box-border' : 'rounded relative border-gray-200 border-2 p-4 pt-2 w-[370px] h-[153px]'}
			style={{
				display: state.deleted ? 'none' : 'block',
			}}
		>
			{props.exam.pending && (
				<div
					className={
						mobile
							? 'absolute top-0 left-0 w-full bg-red-500  text-[12px] flex justify-center items-center h-min px-3 py-[2px] whitespace-nowrap'
							: 'absolute top-0 left-0 w-full bg-red-500  text-[16px] flex justify-center items-center h-min px-3 py-[2px] whitespace-nowrap'
					}
				>
					غير مكتمل
				</div>
			)}

			<div
				id='title'
				className={mobile ? 'text-[20px] flex flex-row justify-between items-center gap-2' : 'text-[30px] flex flex-row justify-between items-center gap-2'}
				style={{
					marginTop: props.exam.pending ? 25 : 0,
				}}
			>
				<div className='flex flex-row justify-center items-center gap-2'>
					<input type='text' value={state.name} className={mobile ? 'w-[80px] bg-transparent' : 'w-[220px] bg-transparent'} onChange={onChange} ref={name} />
				</div>
				<div className='justify-end items-center flex flex-row gap-x-2'>
					{!props.exam.pending && (
						<Eye className={mobile ? 'text-gray-300 basic-hover w-[20px] h-[20px]' : 'text-gray-300 basic-hover'} onClick={() => router.push(`/exam-result?id=${props.exam.id}`)} />
					)}
					{!props.exam.pending && <Pencil className='text-gray-300 basic-hover w-[20px] h-[20px]' onClick={onEdit} />}
					<Trash2 className='text-red-400 basic-hover w-[20px] h-[20px]' onClick={onDelete} />
				</div>
			</div>

			{!props.exam.pending && (
				<div id='description' className={mobile ? 'text-gray-300 text-[12px]' : 'text-gray-300'}>
					{description}
				</div>
			)}

			{props.exam.pending ? (
				<div
					className={
						mobile
							? 'rounded-full p-1 flex justify-center items-center text-black bg-orange-300 mt-3 basic-hover text-[12px]'
							: 'rounded-full p-2 flex justify-center items-center text-black bg-orange-300 mt-3 basic-hover'
					}
					onClick={() => {
						localStorage.setItem('active-exam', props.exam.id);
						router.push('/take-exam');
					}}
				>
					اكمال الاختبار
				</div>
			) : (
				<div className={mobile ? 'mt-2 flex flex-row gap-4 absolute bottom-0 mb-2' : 'mt-8 flex flex-row gap-4'}>
					<div className='flex flex-row gap-1 justify-center items-center h-min'>
						<BookOpenCheck className={mobile && 'w-[20px] h-[20px]'} />
						<div className={mobile ? 'text-[12px] text-gray-400' : 'text-[14px] text-gray-400'}>
							{props.exam.data.filter((item: any) => item.chosen == item.true).length}/{props.exam.data.length}
						</div>
					</div>
					<div className='flex flex-row gap-1 justify-center items-center h-min'>
						<Timer className={mobile && 'w-[20px] h-[20px]'} />
						<div className={mobile ? 'text-[12px] text-gray-400' : 'text-[14px] text-gray-400'}>{formatSeconds(props.exam.duration)}</div>
					</div>
				</div>
			)}
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
		router.push('/make-exam');
	};
	let mobile = useMediaQuery('only screen and (max-width: 1212px)');

	return (
		<div className='relative w-full h-full'>
			<div
				className={
					mobile
						? 'w-full h-full flex flex-row flex-wrap content-start gap-4 p-8 overflow-y-scroll relative pb-20'
						: 'w-full h-full flex flex-row flex-wrap content-start gap-8 p-8 overflow-y-scroll relative pb-20'
				}
			>
				<div
					id='new-exam'
					className={
						mobile
							? 'rounded-2xl border-[#37B294] border-[4px] p-4 w-[200px] justify-center items-center flex h-[80px]'
							: 'rounded-2xl border-[#37B294] border-[7px] p-4 w-[370px] justify-center items-center flex h-[153px]'
					}
					onClick={() => newExam()}
				>
					<CirclePlus className={mobile ? 'w-[48px] h-[48px] text-[#37B294]' : 'w-[80px] h-[80px] text-[#37B294]'} />
				</div>
				{state.exams
					.sort((a: any, b: any) => b.date - a.date)
					.map((exam: any, index: number) => {
						return <Exam exam={exam} key={`exam-${index}`} />;
					})}
			</div>
		</div>
	);
}
