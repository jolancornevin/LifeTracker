export const yyyymmdd = function (date: Date): string {
	var mm = date.getMonth() + 1; // getMonth() is zero-based
	var dd = date.getDate();

	return [
		date.getFullYear(),
		(mm > 9 ? '' : '0') + mm,
		(dd > 9 ? '' : '0') + dd,
	].join('');
};
