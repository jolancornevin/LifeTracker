import React from 'react';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { StyleSheet, View, Text, ScrollView } from 'react-native';

import { RealmContext } from '../../models/main';
import { Event } from '../../models/event';
import { ACTIVITY_TYPES } from '../../models/event_settings';
import { computeMonthStartAndEndDate, ddmmyyyy } from '../../utils';
import { FooterNavigation } from '../utils/footer_navigation';
import { NextScreenButton } from '../utils/next_screen_button';
import { DayRatingsReport } from './day_rating';
import { ActivitiesReport } from './activities_report';

const { useRealm, useQuery } = RealmContext;

type RootStackParamList = {
	ReportUI: {
		// useRealm: () => Realm;
		monthly: boolean;
		date: Date;
	};
};

const getNoticeableEventsForDate = (date: Date): Event[] => {
	const { start_date, end_date } = computeMonthStartAndEndDate(date);

	let events = useQuery(Event).filtered(
		`date >= ${start_date.getTime()} and date < ${end_date.getTime()} and type = '${ACTIVITY_TYPES.Noticeable}'`,
	);

	let result = [];

	events.forEach((event: Event) => {
		if (!event.value) {
			return;
		}

		result.push(event);
	});

	return result;
};

export const ReportUI = ({ route }: BottomTabScreenProps<RootStackParamList, 'ReportUI'>) => {
	const isMonthly = route.params.monthly;

	const date = new Date(route.params.date);

	const noticeable = getNoticeableEventsForDate(date) || [];

	return (
		<FooterNavigation>
			<ScrollView>
				<View style={styles.content}>
					<Text style={{ fontSize: 20, fontWeight: '600' }}>🔥 Congrats ! 🔥</Text>

					<DayRatingsReport date={date} />

					<ActivitiesReport date={date} />

					<View
						style={{
							...styles.content,
							width: '100%',
						}}
					>
						<Text
							style={{
								fontSize: 16,
								fontWeight: '600',
								marginBottom: 8,
							}}
						>
							Noticeable 🎉
						</Text>
						<View
							style={{
								flex: 1,
								width: '100%',
								flexDirection: 'column',
								justifyContent: 'flex-start',
							}}
						>
							<View>
								{noticeable.map((event) => (
									<View key={event.value} style={{ flexDirection: 'row' }}>
										<Text style={{ textDecorationLine: 'underline' }}>
											{ddmmyyyy(new Date(event.date))}:
										</Text>
										<Text> {event.value}</Text>
									</View>
								))}
							</View>
						</View>
					</View>
				</View>
			</ScrollView>
			<NextScreenButton
				nextScreenName={null}
				params={{
					date: date.toJSON(),
				}}
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
		width: '100%',
		paddingTop: 32,
	},
	input: {
		height: 30,
		width: 80,

		borderWidth: 1,
		borderRadius: 5,

		paddingLeft: 10,
		marginLeft: 10,
	},
});
