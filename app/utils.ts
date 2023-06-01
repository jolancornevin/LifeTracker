
export const ddmmyyyy = function (date: Date): string {
	var mm = date.getMonth() + 1; // getMonth() is zero-based
	var dd = date.getDate();

	return formatToDate(dd, mm, date.getFullYear());
};


export const formatToDate = function (day: number, month: number, year: number): string {
	return [
		(day > 9 ? '' : '0') + day,
		'/',
		(month > 9 ? '' : '0') + month,
		'/',
		year,
	].join('');
};

