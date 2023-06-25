import * as React from 'react';

import { Text, Button, TouchableOpacity, View } from 'react-native';

import { ddmmyyyy, stringToDate } from '../../utils';

export const Header = ({
	date,
	setDate,
	setCalendarVisible,
}: {
	date: string;
	setDate: React.Dispatch<React.SetStateAction<string>>;
	setCalendarVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	return (
		<View
			style={{
				flexDirection: 'row',

				alignItems: 'center',
				justifyContent: 'center',

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
					const dateAsDate = stringToDate(date);
					dateAsDate.setDate(dateAsDate.getDate() - 1);
					setDate(ddmmyyyy(dateAsDate));
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
				onPress={() => setCalendarVisible(true)}
			>
				<Text
					style={{
						alignItems: 'center',
						textDecorationLine: 'underline',
					}}
				>
					{date}
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
				}}
				onPress={() => {
					const dateAsDate = stringToDate(date);
					dateAsDate.setDate(dateAsDate.getDate() + 1);
					setDate(ddmmyyyy(dateAsDate));
				}}
			>
				<Text>
					{"Next >"}
				</Text>
			</TouchableOpacity>
		</View>
	);
};
