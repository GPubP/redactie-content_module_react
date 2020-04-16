import { Observable } from 'rxjs';

export function onEmit<T>(source$: Observable<T>, nextFn: (value: T) => void): any {
	return source$.subscribe(nextFn, console.error);
}
