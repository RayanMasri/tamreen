'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import './page.css';

function Field(props: { name: string; checked: boolean; onClick: () => void }) {
	return (
		<div className='question-field rounded-xl w-full p-4 bg-gray-300 text-black flex flex-row justify-start item-center gap-2 text-[16px]' onClick={props.onClick}>
			<input type='radio' onChange={(event) => event.preventDefault()} checked={props.checked} className='pointer-events-none'></input>
			<div>{props.name}</div>
		</div>
	);
}
function Button(props: { label: string; onClick: () => void }) {
	return (
		<div className='bottom-button w-[80px] rounded-xl p-3 text-[20px] bg-gray-300 text-black flex items-center justify-center text-center' onClick={props.onClick}>
			{props.label}
		</div>
	);
}

export default function Home() {
	const router = useRouter();

	const [state, _setState] = useState<{
		exam: any[];
		start: number;
		index: number;
		selected: number[];
		error: string;
	}>({
		exam: [
			{
				answers: ['قابيل : عيسى', 'يعقوب : صالح', 'فرعون : موسى', 'هرقل :بيزنطة'],
				chosen: '',
				id: 3217,
				notes: 'فئة أنبياء, يعقوب و صالح أنبياء.',
				question: 'إبراهيم : محمد',
				skill: 'verbal-analogy',
				true: 'يعقوب : صالح',
			},
		],
		start: 0,
		index: 0,
		selected: [-1, -1, -1],
		error: '',
	});

	const _state: any = useRef(null);
	const setState = (data: any) => {
		_state.current = data;
		_setState(data);
	};

	const onSelect = (index: number) => {
		let selected = [..._state.current.selected];

		selected[_state.current.index] = index;

		setState({
			..._state.current,
			selected: selected,
		});
	};

	const onPrevious = () => {
		setState({
			...state,
			index: state.index - 1,
			error: '',
		});
	};
	const onNext = () => {
		setState({
			...state,
			index: state.index + 1,
			error: '',
		});
	};

	const onSubmit = () => {
		if (state.selected.includes(-1)) {
			setState({
				...state,
				error: `${state.selected.filter((e) => e == -1).length} أسئلة غير محلوله`,
			});
			return;
		}

		let exams = JSON.parse(localStorage.getItem('exams') || '[]');

		let exam = [...state.exam];

		for (let index in exam) {
			exam[index].chosen = exam[index].answers[state.selected[index]];
		}

		exams.push({
			data: exam,
			id: exams.length,
			duration: Date.now() - state.start,
		});

		localStorage.setItem('exams', JSON.stringify(exams));

		router.push(`/exam-result?id=${exams.length - 1}`);
	};

	useEffect(() => {
		let exam = JSON.parse(localStorage.getItem('exam') || '[]');
		console.log(exam);
		if (exam.length == 0) {
			router.push('/exams');
		}
		setState({
			...state,
			exam: exam,
			selected: new Array(exam.length).fill(-1),
			start: Date.now(),
		});

		document.addEventListener('keydown', (event) => {
			if (['1', '2', '3', '4'].includes(event.key)) {
				console.log('hi');
				onSelect(parseInt(event.key) - 1);
			}
		});
	}, []);

	const skills: any = {
		'verbal-analogy': 'تناظر لفظي',
		'contextual-error': 'خطأ سياقي',
		'sentence-completion': 'إكمال جمل',
	};

	return (
		<div className='w-full h-full flex'>
			{state.exam != null && (
				<div className='w-full h-full bg-[#09090B] flex flex-col items-start'>
					<div className='w-full flex flex-row justify-center items-center'>
						<div className='w-full p-4 bg-gray-800 h-[50px]'>
							<div className='w-full relative rounded-xl overflow-hidden h-full'>
								<div className='bg-gray-600 w-full absolute h-full'>&nbsp;</div>
								<div
									className={`bg-green-500 absolute h-full`}
									style={{
										width: `${Math.floor((state.selected.filter((e) => e != -1).length / state.exam.length) * 100)}%`,
									}}
								>
									&nbsp;
								</div>
							</div>
						</div>
					</div>
					<div className='w-full h-full flex-col flex justify-center items-center'>
						<div className='w-[500px] h-full flex flex-col justify-center items-start'>
							<div className='text-gray-300 text-[20px]'>
								السؤال {state.index + 1} - {skills[state.exam[state.index].skill]}
							</div>
							<div className='text-[20px]'>{state.exam[state.index].question}</div>
							<div id='fields' className='w-full flex flex-col justify-center items-center gap-4 mt-4'>
								{state.exam[state.index].answers.map((answer: string, index: number) => {
									return <Field name={answer} checked={state.selected[state.index] == index} onClick={() => onSelect(index)} key={`${state.index}-${index}`} />;
								})}
							</div>
						</div>
						<div className='flex flex-row gap-2 justify-center items-center mb-2 pt-2'>
							{state.index != 0 && <Button label='السابق' onClick={onPrevious}></Button>}
							{state.index + 1 != state.exam.length && <Button label='التالي' onClick={onNext}></Button>}
							{state.index + 1 == state.exam.length && <Button label='إنهاء' onClick={onSubmit}></Button>}
						</div>
						<div className='mb-6 text-red-600'>{state.error}</div>
					</div>
				</div>
			)}
		</div>
	);
}
