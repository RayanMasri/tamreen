import { useState, useEffect } from 'react';

export default function useMediaQuery(mediaQueryString: string) {
	const [matches, setMatches] = useState<any>(null);

	useEffect(() => {
		const mediaQueryList: any = window.matchMedia(mediaQueryString);
		const listener = () => setMatches(!!mediaQueryList.matches);
		listener();
		mediaQueryList.addEventListener('change', listener);
		return () => mediaQueryList.removeEventListener('change', listener);
	}, [mediaQueryString]);

	return matches;
}
