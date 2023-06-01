import * as React from 'react';

import { Text, TouchableOpacity, View } from 'react-native';

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
			}}
		>
			<TouchableOpacity
				style={{ flex: 1, alignItems: 'center' }}
				onPress={() => {
					const dateAsDate = stringToDate(date);
					dateAsDate.setDate(dateAsDate.getDate() - 1);
					setDate(ddmmyyyy(dateAsDate));
				}}
			>
				<Text style={{ color: 'blue', fontWeight: 'bold' }}>
					{'< Prev'}
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={{ flex: 1, alignItems: 'center' }}
				onPress={() => setCalendarVisible(true)}
			>
				<Text
					style={{
						flex: 1,
						alignItems: 'center',
						textDecorationLine: 'underline',
					}}
				>
					{date}
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={{ flex: 1, alignItems: 'center' }}
				onPress={() => {
					const dateAsDate = stringToDate(date);
					dateAsDate.setDate(dateAsDate.getDate() + 1);
					setDate(ddmmyyyy(dateAsDate));
				}}
			>
				<Text style={{ color: 'blue', fontWeight: 'bold' }}>
					{'Next >'}
				</Text>
			</TouchableOpacity>
		</View>
	);
};
