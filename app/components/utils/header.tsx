import * as React from 'react';

import { Text, TouchableOpacity, View } from 'react-native';

import { DDMMyyyy } from '../../utils';
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
					const newDate = new Date(date);
					newDate.setDate(date.getDate() - 1);
					setDate(newDate);
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
				//onPress={() => setCalendarVisible(true)}
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
					const newDate = new Date(date);
					newDate.setDate(date.getDate() + 1);
					setDate(newDate);
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
