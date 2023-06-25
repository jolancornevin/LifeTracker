import * as React from 'react';

import { View, Modal } from 'react-native';

import { Calendar, DateData } from 'react-native-calendars';

import { formatToDate } from '../../utils';

export const CalendarModal = ({
	date,
	calendarVisible,
	setDate,
	setCalendarVisible,
}: {
	date: string;
	calendarVisible: boolean;
	setDate: React.Dispatch<React.SetStateAction<string>>;
	setCalendarVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	let splittedDate = date.split('/');
	let dateForCalendar = [
		splittedDate[2],
		splittedDate[1],
		splittedDate[0],
	].join('-');

	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={calendarVisible}
		>
			<View>
				<Calendar
					onDayPress={(date: DateData) => {
						setDate(formatToDate(date.day, date.month, date.year));
						setCalendarVisible(false);
					}}
					markedDates={{
						[dateForCalendar]: { selected: true },
					}}
				/>
			</View>
		</Modal>
	);
};
