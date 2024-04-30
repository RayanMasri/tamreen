'use client';
import './page.css';
import useMediaQuery from '../../../hooks/media-hook';
function Section(props: any) {
	let mobile = useMediaQuery('only screen and (max-width: 1212px)');
	return (
		<div className={props.className} id={props.id}>
			<div className={mobile ? 'text-[30px]' : 'text-[50px]'}>{props.title}</div>
			<div className='bg-white w-full h-[1px] my-2'>&nbsp;</div>
			<div>{props.children}</div>
		</div>
	);
}

export default function Home() {
	let mobile = useMediaQuery('only screen and (max-width: 1212px)');

	return (
		<div
			className={
				mobile
					? 'w-full h-full relative justify-start items-start p-6 text-[15px] flex flex-col gap-y-2 overflow-y-scroll'
					: 'w-full h-full relative justify-start items-start p-6 text-[30px] flex flex-col gap-y-8 overflow-y-scroll'
			}
		>
			<Section title='حولنا'>
				تمرين هو وجهتك النهائية لإتقان اختبار القدرات. نحن ندرك أن التحضير لاختبار القدرات العامة قد يكون أمرًا شاقًا، ولهذا السبب قمنا بإنشاء منصة شاملة لمساعدتك على التفوق بثقة.
			</Section>
			<Section title='مهمتنا'>
				مهمتنا في تمرين بسيطة: تزويدك بالمعرفة والمهارات اللازمة لاجتياز اختبار القدرات. نحن نؤمن بأن الإعداد يجب أن يكون متاحًا وجذابًا ومصممًا خصيصًا لتلبية احتياجاتك الفردية. من خلال قاعدة
				بياناتنا الواسعة التي تضم أكثر من 6000 سؤال منسق بدقة، يمكنك تخصيص تجربة دراستك للتركيز على المجالات التي تحتاج إلى أكبر قدر من التحسين.
			</Section>
			<Section title='سجل اليوم'>
				هل أنت على استعداد للانتقال بتحضير اختبار القدرات إلى المستوى التالي؟ قم بالتسجيل في تمرين اليوم وابدأ رحلتك نحو إتقان القدرات. من خلال اختباراتنا القابلة للتخصيص، وبنك الأسئلة الشامل،
				وأدوات تتبع التقدم، واشارت الإنجاز، ودعم الخبراء، سيكون لديك كل ما تحتاجه لاجتياز اختبار القدرات بثقة. دعونا نتغلب على اختبار القدرات معًا — لأن النجاح يبدأ بالتحضير.
			</Section>
		</div>
	);
}
