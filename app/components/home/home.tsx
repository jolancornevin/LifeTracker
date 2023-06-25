import React, { useCallback, useMemo } from 'react';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { DayRatingUI } from './day_rating';

import { ddmmyyyy } from '../../utils';
import { RealmContext } from '../../models';
import { Header } from '../utils/header';
import { CalendarModal } from '../utils/calendar_modal';
import { FooterNavigation } from '../utils/footer_navigation';
import { NextScreenButton } from '../utils/next_screen_button';

const { useRealm, useQuery } = RealmContext;

type RootStackParamList = {
	HomeUI: {
		// useRealm: () => Realm;
	};
};

export const HomeUI = ({
	route,
}: BottomTabScreenProps<RootStackParamList, 'HomeUI'>) => {
	const realm = useRealm();

	const [calendarVisible, setCalendarVisible] = React.useState(false);
	const [date, setDate] = React.useState(ddmmyyyy(new Date()));

	return (
		<FooterNavigation>
			<View style={styles.wrapper}>
				<Header
					date={date}
					setDate={setDate}
					setCalendarVisible={setCalendarVisible}
				/>

				<View style={styles.content}>
					<Text style={{ fontSize: 26, paddingBottom: 50 }}>
						How was your day? 😃
					</Text>

					<DayRatingUI realm={realm} date={date} />
				</View>
			</View>

			<NextScreenButton nextScreenName={'VirtuesUI'}/>

			<CalendarModal
				date={date}
				calendarVisible={calendarVisible}
				setDate={setDate}
				setCalendarVisible={setCalendarVisible}
			/>

		</FooterNavigation>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		alignItems: 'center',
	},
	content: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	nextWrapper: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 60,
		height: 60,

		alignItems: 'center',
		justifyContent: 'space-evenly',
	},
	nextButton: {
		paddingTop: 5,
		paddingBottom: 5,
		paddingLeft: 20,
		paddingRight: 20,

		borderWidth: 1,
		borderRadius: 10,
		borderColor: 'grey',

		backgroundColor: 'white'
	}
});