import * as React from 'react';

import { Modal, View } from 'react-native';

import { Calendar, DateData } from 'react-native-calendars';

import { newDate } from '../../utils';

export const CalendarModal = ({
	date,
	calendarVisible,
	setDate,
	setCalendarVisible,
}: {
	date: Date;
	calendarVisible: boolean;
	setDate: React.Dispatch<React.SetStateAction<Date>>;
	setCalendarVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	let dateForCalendar = [date.getUTCFullYear(), date.getMonth(), date.getUTCDate()].join('-');

	return (
		<Modal animationType="slide" transparent={true} visible={calendarVisible}>
			<View>
				<Calendar
					onDayPress={(date: DateData) => {
						setDate(newDate(date.year, date.month - 1, date.day + 1));
						setCalendarVisible(false);
					}}
					markedDates={{
						[dateForCalendar]: { selected: true },
					}}
					firstDay={1}
				/>
			</View>
		</Modal>
	);
};
