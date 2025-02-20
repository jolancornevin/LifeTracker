import React from 'react';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Event } from '../../models/event';
import { ACTIVITY_TYPES, getEventsSettings } from '../../models/event_settings';
import { RealmContext } from '../../models/main';
import { computeMonthStartAndEndDate, ddmmyyyy } from '../../utils';
import { FooterNavigation } from '../utils/footer_navigation';
import { NavigationButtons } from '../utils/next_screen_button';
import { ActivitiesReport } from './activities_report';
import { DayRatingsReport } from './day_rating';
import { Chart } from './chart';
import { HeaderContext, HeaderTitle } from '../utils/header';

const { useRealm, useQuery } = RealmContext;

const getNoticeableEventsForDate = (date: Date): Event[] => {
	const { startDate, endDate } = computeMonthStartAndEndDate(date);

	let events = useQuery(Event).filtered(
		`date >= ${startDate.getTime()} and date < ${endDate.getTime()} and type = '${ACTIVITY_TYPES.Noticeable}'`,
	);

	let result: Event[] = [];

	events.forEach((event: Event) => {
		if (!event.value) {
			return;
		}

		result.push(event);
	});

	return result;
};

export const ReportUI = () => {
	const realm = useRealm();

	// const date = new Date(route.params.date);
	const { _date } = React.useContext(HeaderContext);
	const date = React.useMemo(() => new Date(_date), [_date]);

	const noticeable = getNoticeableEventsForDate(date) || [];

	const recuringEventSettingsDict = Object.fromEntries(
		getEventsSettings(realm).map((setting) => [setting.label, setting]),
	);

	return (
		<FooterNavigation>
			<>
				<ScrollView>
					<View style={styles.content}>
						<View style={{ paddingHorizontal: 20 }}>
							<Text style={{ fontSize: 20, fontWeight: '600' }}>🔥 Congrats ! 🔥</Text>

							<DayRatingsReport date={date} />
						</View>

						<Chart date={date} eventsLabels={Object.keys(recuringEventSettingsDict)} />

						<ActivitiesReport date={date} recuringEventSettingsDict={recuringEventSettingsDict} />

						<View style={{ paddingHorizontal: 20 }}>
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
					</View>
				</ScrollView>
				<NavigationButtons />
			</>
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
