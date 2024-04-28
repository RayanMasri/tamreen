'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import './page.css';
import data from '../data.json';

function Category(props: any) {
	return (
		<div className='flex flex-col justify-start items-center w-full h-min text-[20px]' style={props.style}>
			<div className='flex flex-row justify-start items-center gap-x-1 w-full'>
				<div className='bg-white rounded w-[24px] h-[24px] basic-hover ml-1' onClick={props.onToggle}>
					{props.checked && <Check className='text-black' />}
				</div>
				<div>{`${props.name}${props.checked ? ': ' + props.count : ''}`}</div>
			</div>
			{props.checked && <input type='range' min='1' max='30' value={props.count} className='w-full mt-1' onChange={props.onChange} />}
			{/* <input type='slider' className='w-full bg-transparent' /> */}
		</div>
	);
}

let defaultCategories = [
	{ name: 'تناظر لفظي', status: true, count: 10 },
	{ name: 'خطأ سياقي', status: true, count: 10 },
	{ name: 'إكمال جمل', status: true, count: 10 },
];

const skills: any = {
	'verbal-analogy': 'تناظر لفظي',
	'contextual-error': 'خطأ سياقي',
	'sentence-completion': 'إكمال جمل',
};

const getCategories = () => {
	let categories: any = localStorage.getItem('categories');
	if (categories != '') {
		categories = JSON.parse(categories);
	} else {
		categories = [...defaultCategories];
	}
	return categories;
};

function Button(props: any) {
	return (
		<div className='basic-hover rounded p-2 flex justify-center items-center w-full h-min bg-orange-300' onClick={props.onClick}>
			{props.children}
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

export default function Home() {
	const router = useRouter();

	const [state, setState] = useState<any>({
		categories: [],
		name: “”,
		error: '',
	});

	const toggleStatus = (index: number) => {
		let categories = [...state.categories]

		categories[index].status = !categories[index].status;

		localStorage.setItem('categories', JSON.stringify(categories));

		setState({
			...state,
			categories: categories,
			error: '',
		});
	};

	const onChange = (index: number, event: any) => {
		let categories = [...state.categories]

		categories[index].count = event.target.value;

		localStorage.setItem('categories', JSON.stringify(categories));

		setState({
			...state,
			categories: categories,
			error: '',
		});
	};

	const onNameChange = (event: any) => {
		setState({
			...state,
			name: event.target.value,
			error: '',
		});
	};

	const onSubmit = () => {
		if (state.categories.filter((e: any) => e.status).length == 0) {
			return setState({
				...state,
				error: 'قم باختيار واحد على الأقل',
			});
		}

		console.log(state.categories);

		let questions: any = [];
		for (let [key, value] of Object.entries(data)) {
			shuffle(value);

			let category = state.categories.filter((e: any) => e.name == skills[key])[0];

			if (!category.status) continue;

			questions.push(
				value.slice(0, parseInt(category.count)).map((question: any) => {
					return {
						...question,
						skill: key,
						chosen: '',
					};
				})
			);
		}

		questions = questions.flat();
		let exams = JSON.parse(localStorage.getItem('exams') || '[]');
		let active = exams.length == 0 ? 0 : exams.sort((a: any, b: any) => b.id - a.id)[0].id + 1;
		exams.push({
			data: questions,
			id: active,
			duration: 0,
			date: Date.now(),
			pending: true,
			name: state.name,
		});

		localStorage.setItem('exams', JSON.stringify(exams));
		localStorage.setItem('active-exam', active);
		router.push('/take-exam');
	};
	const onCancel = () => {
		router.push('/main/exams');
	};

 useEffect(() => {
   let categories = getCategories()
	  let exams = JSON.parse(localStorage.getItem('exams') || '[]');

	  let active = exams.length == 0 ? 0 : exams.sort((a: any, b: any) => b.id - a.id)[0].id + 1;

	  let name = `اختبار ${active}`;

   setState({
     ...state,
     categories: categories,
     name: name
   })
 }, [])

	return (
		<div className='w-full h-full fixed top-0 left-0 flex justify-center items-center'>
			<div className='w-[600px] flex flex-col justify-center items-center'>
				<div className='text-[20px] text-white w-full flex justify-start items-center'>اسم الاختبار</div>
				<input type='text' className='bg-transparent border-gray-500 border-2 mt-2 rounded p-2 w-full' placeholder='الاسم' value={state.name} onChange={onNameChange} />
				<div className='w-full bg-white h-[1px] my-4'>&nbsp;</div>

    {state.categories.map((category: any, index: number) => {
      return <Category name={category.name} checked={state.categories[index].status} count={state.categories[index].count} onToggle={() => toggleStatus(index)} onChange={(event: any) => onChange(index, event)} />
    })}

				<div className='w-full bg-white h-[1px] my-4'>&nbsp;</div>
				<div className='w-full text-black justify-between flex items-center gap-x-2 text-[16px]'>
					<Button onClick={onSubmit}>إنشاء</Button>
					<Button onClick={onCancel}>إلغاء</Button>
				</div>
				{state.error && <div className='w-full text-right flex justify-start items-center text-red-400 mt-2'>{state.error}</div>}
			</div>
		</div>
	);
}
