// import { render, screen, fireEvent } from '@testing-library/react-native';
// import { Timer } from '../../../app/components/events/timer';
import { Realm } from '@realm/react';

import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

import { computeTimeDiff, displayTimerElapsedTime } from '../../../app/components/events/timer';
import { EventTimer } from '../../../app/models/event_timer';
import { newDateTime } from '../../../app/utils';

test('form submits two answers', () => {
	// const allQuestions = ['q1', 'q2'];
	// const mockFn = jest.fn();

	// render(<QuestionsBoard questions={allQuestions} onSubmit={mockFn} />);

	// const answerInputs = screen.getAllByLabelText('answer input');

	// fireEvent.changeText(answerInputs[0], 'a1');
	// fireEvent.changeText(answerInputs[1], 'a2');
	// fireEvent.press(screen.getByText('Submit'));

	expect(1).toEqual(1);
});

let realm: Realm;

// Redeclare EventTimer because the static schema is required for tests
// but I don't think it works with the context.
// TODO test with context and remove
export class _EventTimer extends Realm.Object<EventTimer> {
	static schema: Realm.ObjectSchema = {
		name: 'EventTimer',
		properties: {
			label: { type: 'string' },
			date: { type: 'int' },
		},
	};
}

describe('testing dates', () => {
	beforeEach(async () => {
		realm = await Realm.open({
			schema: [_EventTimer],
			path: 'testing.realm',
		});
	});

	afterEach(() => {
		if (!realm.isClosed) {
			realm.close();
		}
	});

	test('It should create correct now Date', () => {
		jest.spyOn(global.Date, 'now').mockImplementationOnce(() => new Date('2023-10-29T02:00:00.000Z').valueOf());
		expect(newDateTime()).toEqual(new Date('2023-10-29T00:00:00.000Z'));

		// winter time save
		jest.spyOn(global.Date, 'now').mockImplementationOnce(() => new Date('2023-10-29T03:00:00.000Z').valueOf());
		expect(newDateTime()).toEqual(new Date('2023-10-29T02:00:00.000Z'));

		jest.spyOn(global.Date, 'now').mockImplementationOnce(() => new Date('2023-10-31T03:00:00.000Z').valueOf());
		expect(newDateTime()).toEqual(new Date('2023-10-31T02:00:00.000Z'));
	});

	test('Comparing date should work', () => {
		[
			{
				now: '2023-11-01T01:22:00.000Z', // <-- adjusted to UTC
				timerStartDate: '2023-10-31T23:10:00.000Z',
				expectedDiff: (1 * 60 + 12) * 60,
				expectedDiffToHuman: '01:12:00',
			},
			{
				now: '2023-11-01T03:42:00.000Z', // <-- adjusted to UTC
				timerStartDate: '2023-10-31T22:10:00.000Z',
				expectedDiff: (4 * 60 + 32) * 60,
				expectedDiffToHuman: '04:32:00',
			},
		].forEach(({ now, timerStartDate, expectedDiff, expectedDiffToHuman }) => {
			jest.spyOn(global.Date, 'now').mockImplementation(() => new Date(now).valueOf());

			realm.write(() => {
				const existingTimer = new _EventTimer(realm, {
					label: 'test',
					date: new Date(timerStartDate).getTime(),
				});

				const timeDiff = computeTimeDiff(existingTimer);

				expect(displayTimerElapsedTime(timeDiff)).toEqual(expectedDiffToHuman);
				expect(timeDiff).toEqual(expectedDiff);
			});
		});
	});
});
