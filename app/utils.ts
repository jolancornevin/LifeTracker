import { useMemo } from 'react';

// Create a new date, without any time specific info
export const newDate = function (year?: number, month?: number, day?: number): Date {
	let d = new Date();
	if (year !== undefined && month !== undefined && year !== undefined) {
		d = new Date(year, month, day);
	}
	d.setUTCHours(0, 0, 0, 0);

	return d;
};

export const ddmmyyyy = function (date: Date): string {
	var mm = date.getUTCMonth() + 1; // getMonth() is zero-based
	var dd = date.getUTCDate();

	return formatToDate(dd, mm, date.getUTCFullYear());
};

export const DDMMyyyy = function (date: Date): string {
	var days = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thur.', 'Fri.', 'Sat.'];
	var months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	var mm = months[date.getUTCMonth()];
	var dd = days[date.getUTCDay()];

	return `${dd} ${date.getUTCDate()} ${mm} ${date.getUTCFullYear()}`;
};

export const formatToDate = function (day: number, month: number, year: number): string {
	return [(day > 9 ? '' : '0') + day, '/', (month > 9 ? '' : '0') + month, '/', year].join('');
};

export const stringToDate = function (date: string): Date {
	const splittedDate = date.split('/');
	let d = new Date();
	d.setUTCFullYear(parseInt(splittedDate[2]), parseInt(splittedDate[1]) - 1, parseInt(splittedDate[0]));
	d.setUTCHours(0, 0, 0, 0);
	return d;
};

export const computeMonthStartAndEndDate = (date: Date) => {
	let start_date = useMemo(() => {
		const d = newDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1);
		d.setDate(1);

		return d;
	}, [date]);

	let end_date = useMemo(() => {
		const d = newDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1);
		d.setDate(1);
		d.setMonth(d.getUTCMonth() + 1);

		return d;
	}, [date]);

	return { start_date, end_date };
};

export const computeWeekStartAndEndDate = (date: Date) => {
	// start date is the beginning of the week
	let start_date = useMemo(() => {
		let d = newDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1);
		d.setDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));

		return d;
	}, [date]);

	// end date is now (+ 1 because the query is <)
	let end_date = useMemo(() => {
		const d = newDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1);

		d.setDate(start_date.getUTCDate() + 7);
		return d;
	}, [start_date, date]);

	return { start_date, end_date };
};
