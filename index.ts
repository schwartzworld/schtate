import Maybe from './src/Maybe';
import nothing from './src/nothing';

const f = Maybe.create(Math.random() > 0.5 "something" | nothing)

const g: string[] = f.map(num => num * 2).reduce((str, num) => {
	return str + String(num);
}, "Some other shit ").reduce((arr, str) => {
	str.split('').forEach(l => arr.push(l));
	return arr;
}, [])

console.log(arr);