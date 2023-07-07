import * as React from 'react';

import { Text, Button, TouchableOpacity, View } from 'react-native';

import { ddmmyyyy, stringToDate } from '../../utils';
import { CalendarModal } from './calendar_modal';

export const Header = ({
	date,
	setDate,
}: {
	date: Date;
	setDate: React.Dispatch<React.SetStateAction<Date>>;
}) => {
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
				borderColor: 'grey'
			}}
		>
			<TouchableOpacity
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
				}}
				onPress={() => {
					const newDate = new Date(date);
					newDate.setDate(date.getDate() - 1);
					setDate(newDate);
				}}
			>
				<Text>
					{"< Prev"}
				</Text>
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
					{ddmmyyyy(new Date(date))}
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
				}}
				onPress={() => {
					const newDate = new Date(date);
					newDate.setDate(date.getDate() + 1);
					setDate(newDate);
				}}
			>
				<Text>
					{"Next >"}
				</Text>
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
