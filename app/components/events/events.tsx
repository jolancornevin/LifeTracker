import React, { useCallback, useMemo } from 'react';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { StyleSheet, View, Text, Button, TextInput } from 'react-native';
import { RealmContext } from '../../models';

import { ddmmyyyy } from '../../utils';
import { Header } from '../utils/header';
import { CalendarModal } from '../utils/calendar_modal';
import { FooterNavigation } from '../utils/footer_navigation';

const { useRealm, useQuery } = RealmContext;

type RootStackParamList = {
	EventUI: {
		// useRealm: () => Realm;
	};
};

export const EventUI = ({
	route,
}: BottomTabScreenProps<RootStackParamList, 'EventUI'>) => {
	const realm = useRealm();

	const [calendarVisible, setCalendarVisible] = React.useState(false);
	const [date, setDate] = React.useState(ddmmyyyy(new Date()));

	return (
		<FooterNavigation>
			<View style={styles.content}>
				<Header
					date={date}
					setDate={setDate}
					setCalendarVisible={setCalendarVisible}
				/>

				<Text>Recuring</Text>
				<View>
					<Text>Music <Button title={'+'}/></Text>

					<Text>Chess <Button title={'+'}/></Text>

					<Text>Gym <Button title={'+'}/></Text>
				</View>

				<Text>Noticable</Text>

				<CalendarModal
					date={date}
					calendarVisible={calendarVisible}
					setDate={setDate}
					setCalendarVisible={setCalendarVisible}
				/>
			</View>
		</FooterNavigation>
	);
};

const styles = StyleSheet.create({
	content: {
		flex: 1,
		paddingTop: 20,
		paddingHorizontal: 20,
	},
});
