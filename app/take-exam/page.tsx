'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Bookmark } from 'lucide-react';
import { useRouter } from 'next/navigation';
import './page.css';

import useMediaQuery from '../../hooks/media-hook';

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

	const [state, _setState] = useState<any>({
		exam: {
			data: [{ skill: '', answers: [] }],
		},
		start: 0,
		index: 0,
		selected: [-1, -1, -1],
		error: '',
		marked: [],
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

		saveExam();
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

	const saveExam = () => {
		let exams = JSON.parse(localStorage.getItem('exams') || '[]');
		let active = parseInt(localStorage.getItem('active-exam') || '-1');

		let examIndex = exams.findIndex((e: any) => e.id == active);
		let exam = exams[examIndex];
		exams[examIndex] = {
			...exam,
			data: exam.data.map((item: any, index: number) => {
				item.chosen = _state.current.exam.data[index].answers[_state.current.selected[index]];
				return item;
			}),
		};

		localStorage.setItem('exams', JSON.stringify(exams));
	};

	const addBadge = (badge: number) => {
		let badges = JSON.parse(localStorage.getItem('badges') || '[]');
		badges.push(badge);
		localStorage.setItem('badges', JSON.stringify(badges));
	};

	const onSubmit = () => {
		if (state.selected.includes(-1)) {
			setState({
				...state,
				error: `${state.selected.filter((e: any) => e == -1).length} أسئلة غير محلوله`,
			});
			return;
		}

		let exams = JSON.parse(localStorage.getItem('exams') || '[]');
		// let active = parseInt(localStorage.getItem('active-exam') || '-1');

		let examIndex = exams.findIndex((e: any) => e.id == _state.current.exam.id);
		let exam = exams[examIndex];
		exams[examIndex] = {
			...exam,
			pending: false,
			duration: Date.now() - state.start,
		};

		localStorage.setItem('exams', JSON.stringify(exams));
		// let [exam, _] = updateExam({
		// 	pending: false,
		// 	duration: Date.now() - state.start,
		// });
		let examsTaken: number = parseInt(localStorage.getItem('exams-taken') || '0');
		examsTaken += 1;
		localStorage.setItem('exams-taken', examsTaken.toString());

		switch (examsTaken) {
			case 1:
				addBadge(0);
				break;
			case 5:
				addBadge(1);
				break;
			case 10:
				addBadge(2);
				break;
			case 25:
				addBadge(3);
				break;
			case 50:
				addBadge(4);
				break;
			case 100:
				addBadge(5);
				break;
		}

		router.push(`/exam-result?id=${exam.id}`);
	};

	useEffect(() => {
		let active = parseInt(localStorage.getItem('active-exam') || '-1');

		let exams = JSON.parse(localStorage.getItem('exams') || '[]');
		console.log(exams);

		let exam = exams.find((e: any) => e.id == active);
		if (!exam) {
			router.push('/main/exams');
			return;
		}

		let marked = JSON.parse(localStorage.getItem('marked') || '[]');

		setState({
			...state,
			exam: exam,
			marked: marked,
			selected: exam.data.map((item: any) => {
				return item.answers.findIndex((e: any) => e == item.chosen);
			}),
			start: exam.date,
		});

		document.addEventListener('keydown', (event) => {
			if (['1', '2', '3', '4'].includes(event.key)) {
				console.log(_state.current);
				onSelect(parseInt(event.key) - 1);
			}
		});
	}, []);

	const onMark = (id: number) => {
		let marked = [...state.marked];

		if (marked.filter((e: any) => e.id == id).length != 0) {
			marked = marked.filter((e: any) => e.id != id);
		} else {
			marked.push({
				id: id,
				date: Date.now(),
			});
		}

		localStorage.setItem('marked', JSON.stringify(marked));

		setState({
			...state,
			marked: marked,
		});
	};

	const skills: any = {
		'verbal-analogy': 'تناظر لفظي',
		'contextual-error': 'خطأ سياقي',
		'sentence-completion': 'إكمال جمل',
	};

	let mobile = useMediaQuery('only screen and (max-width: 1212px)');

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
										width: `${Math.floor((state.selected.filter((e: any) => e != -1).length / state.exam.data.length) * 100)}%`,
									}}
								>
									&nbsp;
								</div>
							</div>
						</div>
					</div>
					<div className='w-full h-full flex-col flex justify-center items-center'>
						<div className={mobile ? 'w-[300px] h-full flex flex-col justify-center items-start' : 'w-[500px] h-full flex flex-col justify-center items-start'}>
							<div className='text-gray-300 text-[20px] flex flex-row justify-center items-center gap-x-2'>
								<Bookmark
									className='basic-hover'
									style={{
										color: state.marked.filter((e: any) => e.id == state.exam.data[state.index].id).length != 0 ? 'cyan' : 'white',
									}}
									onClick={() => onMark(state.exam.data[state.index].id)}
								/>
								<div>
									السؤال {state.index + 1} - {skills[state.exam.data[state.index].skill]}
								</div>
							</div>
							<div className='text-[20px]'>{state.exam.data[state.index].question}</div>
							<div id='fields' className='w-full flex flex-col justify-center items-center gap-4 mt-4'>
								{state.exam.data[state.index].answers.map((answer: string, index: number) => {
									return <Field name={answer} checked={state.selected[state.index] == index} onClick={() => onSelect(index)} key={`${state.index}-${index}`} />;
								})}
							</div>
						</div>
						<div className='flex flex-row gap-2 justify-center items-center mb-2 pt-2'>
							{state.index != 0 && <Button label='السابق' onClick={onPrevious}></Button>}
							{state.index + 1 != state.exam.data.length && <Button label='التالي' onClick={onNext}></Button>}
							{state.index + 1 == state.exam.data.length && <Button label='إنهاء' onClick={onSubmit}></Button>}
						</div>
						<div className='mb-6 text-red-600'>{state.error}</div>
					</div>
				</div>
			)}
		</div>
	);
}
