import {Maybe} from "./Maybe";

describe('Maybe Monad Tests', () => {
	it('has methods that create a maybe', () => {
		expect.assertions(1);
		const value = 'foo';
		Maybe.create(value).something((val) => {
			expect(val).toEqual(value);
		});
	})


})
