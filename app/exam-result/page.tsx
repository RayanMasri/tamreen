'use client';
import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import './page.css';

function Field(props: { name: string; checked: boolean; correct: boolean; incorrect: boolean }) {
	return (
		<div className='rounded-xl w-full p-4 bg-gray-300 text-black flex flex-row justify-start item-center gap-2 text-[16px]'>
			<input type='radio' onChange={(event) => event.preventDefault()} checked={props.checked} className='pointer-events-none'></input>
			<div>{props.name}</div>
			{props.correct && <Check className='text-green-500' />}
			{props.incorrect && <X className='text-red-500' />}
		</div>
	);
}

function Button(props: { label: string; onClick: () => void }) {
	return (
		<div className='bottom-button w-[80px] rounded-xl p-1 text-[16px] bg-gray-300 text-black flex items-center justify-center text-center' onClick={props.onClick}>
			{props.label}
		</div>
	);
}

export default function Home() {
	const [state, setState] = useState({
		exam: {
			data: [],
			id: -1,
			duration: 0,
		},
	});

	const router = useRouter();
	const searchParams: any = useSearchParams();

	useEffect(() => {
		let id = parseInt(searchParams.get('id'));

		let exams = JSON.parse(localStorage.getItem('exams') || '[]');

		let exam = exams.find((exam: any) => exam.id == id);
		console.log(id);
		console.log(exams);
		console.log(exam);
		if (exam) {
			setState({
				...state,
				exam: exam,
			});
		}

		// setState({
		// 	...state,
		// 	exam: Object.keys(exam).length == 0 ? null : exam,
		// });
	}, []);

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

	const retakeExam = () => {
		console.log(state.exam);
		localStorage.setItem('exam', JSON.stringify(state.exam.data));

		router.push('/take-exam');
	};

	const skills: any = {
		'verbal-analogy': 'تناظر لفظي',
		'contextual-error': 'خطأ سياقي',
		'sentence-completion': 'إكمال جمل',
	};

	return (
		<div className='w-full h-full flex'>
			{state.exam.data.length != 0 ? (
				<div className='w-full h-full bg-[#09090B] flex flex-col items-start'>
					<div className='w-full flex flex-row justify-center items-center'>
						<div className='w-full p-4 bg-gray-800 h-[50px] flex justify-center items-center flex-row gap-4 relative'>
							<div className='absolute right-0 top-0 flex flex-row p-2 gap-2 items-center justify-center'>
								<Button label='الرئيسية' onClick={() => router.push('/main')}></Button>
								<Button label='إعادة' onClick={() => retakeExam()}></Button>
							</div>
							<div>
								{state.exam.data.filter((item: any) => item.chosen == item.true).length}/{state.exam.data.length}
							</div>
							<div>{formatSeconds(state.exam.duration)}</div>
						</div>
					</div>
					<div className='w-full h-full flex-col flex justify-start items-center pt-4 pb-8 overflow-y-scroll gap-y-8'>
						{state.exam.data.map((question: any, index) => {
							return (
								<div className='w-[500px] h-full flex flex-col justify-center items-start' key={`question-${index}`}>
									<div className='text-gray-300 text-[20px]'>
										السؤال {index + 1} - {skills[question.skill]}
									</div>
									<div className='text-[20px]'>{question.question}</div>
									<div id='fields' className='w-full flex flex-col justify-center items-center gap-4 mt-4'>
										{question.answers.map((answer: any, index: number) => {
											return (
												<Field
													name={answer}
													checked={answer == question.chosen}
													correct={answer == question.true}
													incorrect={answer == question.chosen && answer != question.true}
													key={`field-${index}`}
												/>
											);
										})}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			) : (
				<div className='w-full h-full bg-[#09090B] flex flex-col items-start'>لم نجد الاختبار</div>
			)}
		</div>
	);
}
