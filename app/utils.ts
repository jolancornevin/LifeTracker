
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
	var mm = date.getMonth() + 1; // getMonth() is zero-based
	var dd = date.getDate();

	return formatToDate(dd, mm, date.getFullYear());
};

export const DDMMyyyy = function (date: Date): string {
	var days = ['Sun.','Mon.','Tue.','Wed.','Thur.','Fri.','Sat.'];
	var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

	var mm = months[date.getMonth()];
	var dd = days[date.getDay()];

	return `${dd} ${date.getDate()} ${mm} ${date.getFullYear()}`;
};

export const toUTC = function (date: Date): string {
	var mm = date.getMonth() + 1; // getMonth() is zero-based
	var dd = date.getDate();

	return `${date.getFullYear()}-${mm}-${dd}T00:00:00:0000000000`;
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

export const stringToDate = function (date: string): Date {
	const splittedDate = date.split('/');
	let d = new Date();
	d.setUTCFullYear(parseInt(splittedDate[2]), parseInt(splittedDate[1]) -1, parseInt(splittedDate[0]));
	d.setUTCHours(0, 0, 0, 0);
	return d;
};