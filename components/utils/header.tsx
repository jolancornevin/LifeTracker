import * as React from 'react';

import { useNavigation } from '@react-navigation/native';

import { Text, TouchableOpacity, Button, View } from 'react-native';

import { CustomButton, DDMMyyyy, newDate } from '../../utils';
import { CalendarModal } from './calendar_modal';

export const HeaderContext = React.createContext<{
	_date: string;
	setDate: React.Dispatch<React.SetStateAction<Date>>;
}>({
	_date: newDate().toJSON(),
	setDate: () => {},
});

export const HeaderTitle = ({}: {}) => {
	return (
		<View style={{ flex: 1, alignItems: 'center' }}>
			<Header />
		</View>
	);
};

export const Header = ({}: {}) => {
	const [calendarVisible, setCalendarVisible] = React.useState(false);
	const { _date, setDate } = React.useContext(HeaderContext);

	const date = React.useMemo(() => new Date(_date), [_date]);

	const previousDay = React.useCallback(() => {
		const previousDate = newDate(date.getUTCFullYear(), date.getMonth(), date.getUTCDate() - 1);
		setDate(previousDate);
	}, [date, setDate]);

	const nextDay = React.useCallback(() => {
		const nextDate = newDate(date.getUTCFullYear(), date.getMonth(), date.getUTCDate() + 1);
		setDate(nextDate);
	}, [date, setDate]);

	return (
		<View
			style={{
				flexDirection: 'row',

				alignItems: 'center',
				justifyContent: 'center',

				// marginRight: 25,

				height: 40,

				borderWidth: 1,
				borderRadius: 10,
				borderColor: 'grey',
			}}
		>
			<CustomButton
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
					maxWidth: 100,
				}}
				onPress={previousDay}
			>
				<Text>{'< Prev'}</Text>
			</CustomButton>

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
					{DDMMyyyy(date)}
				</Text>
			</TouchableOpacity>

			<CustomButton
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
					maxWidth: 100,
				}}
				onPress={nextDay}
			>
				<Text>{'Next >'}</Text>
			</CustomButton>

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
