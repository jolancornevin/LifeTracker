import * as React from 'react';

import { Text, TouchableOpacity, View } from 'react-native';

import { DDMMyyyy, newDate } from '../../utils';
import { CalendarModal } from './calendar_modal';

export const Header = ({ date, setDate }: { date: Date; setDate: React.Dispatch<React.SetStateAction<Date>> }) => {
	const [calendarVisible, setCalendarVisible] = React.useState(false);

	return (
		<View
			style={{
				flexDirection: 'row',

				alignItems: 'center',
				justifyContent: 'center',

				marginRight: 25,

				height: 40,

				borderWidth: 1,
				borderRadius: 10,
				borderColor: 'grey',
			}}
		>
			<TouchableOpacity
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
					maxWidth: 100,
				}}
				onPress={() => {
					// for some reason, getDate returns the date -1. So no need to decrease here
					const previousDate = newDate(date.getUTCFullYear(), date.getMonth(), date.getUTCDate());

					setDate(previousDate);
				}}
			>
				<Text>{'< Prev'}</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
				}}
				onPress={() => setCalendarVisible(true)}
			>
				<Text
					style={{
						alignItems: 'center',
						textDecorationLine: 'underline',
					}}
				>
					{DDMMyyyy(new Date(date))}
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
					maxWidth: 100,
				}}
				onPress={() => {
					// for some reason, getDate returns the date -1, so we add 2 for tomorrow
					const nextDate = newDate(date.getUTCFullYear(), date.getMonth(), date.getUTCDate() + 2);

					setDate(nextDate);
				}}
			>
				<Text>{'Next >'}</Text>
			</TouchableOpacity>

			<CalendarModal
				date={date}
				setDate={(_date) => {
					setDate(_date);
				}}
				calendarVisible={calendarVisible}
				setCalendarVisible={setCalendarVisible}
			/>
		</View>
	);
};
