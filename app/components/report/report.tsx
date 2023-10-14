import React, { useMemo } from 'react';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { StyleSheet, View, Text, ScrollView } from 'react-native';

import { RealmContext } from '../../models/main';
import { Event, NOTICEABLE_LABEL, RecuringNegativeEvents } from '../../models/event';
import { ACTIVITY_TYPES, getEventsSettings } from '../../models/event_settings';
import { computeMonthStartAndEndDate, computeWeekStartAndEndDate, ddmmyyyy, newDate } from '../../utils';
import { Header } from '../utils/header';
import { FooterNavigation } from '../utils/footer_navigation';
import { DayRating } from '../../models/DayRating';
import { ColorForRating } from '../day_rating/day_rating';
import { NextScreenButton } from '../utils/next_screen_button';

const { useRealm, useQuery } = RealmContext;

type RootStackParamList = {
	ReportUI: {
		// useRealm: () => Realm;
		monthly: boolean;
		date: Date;
	};
};

const sumEventsForDateRange = (start_date: Date, end_date: Date): Record<string, number> => {
	let events = useQuery(Event).filtered(
		`date >= ${start_date.getTime()} and date < ${end_date.getTime()} and type != '${ACTIVITY_TYPES.Noticeable}'`,
	);

	let result = {};

	events.forEach((event: Event) => {
		if (!event.value) {
			return;
		}
		if (!result[event.label]) {
			result[event.label] = 0;
		}

		result[event.label] += parseInt(event.value);
	});

	return result;
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

export const DayRatingsReport = ({ date }: { date: Date }) => {
	const { start_date, end_date } = computeMonthStartAndEndDate(date);

	const dayRatings = useQuery(DayRating).filtered(`date >= ${start_date.getTime()} && date < ${end_date.getTime()}`);

	// reset date to the current month, to get the number of days in the month
	end_date.setDate(end_date.getDate() - 1);
	const ratingsColors = Array.from({ length: end_date.getDate() }, () => 'transparent');

	// now iterate over the ratings we have in the db and set the color
	dayRatings.forEach((rating) => {
		if (!rating.value) {
			return;
		}
		// date start at 1
		ratingsColors[new Date(rating.date).getDate() - 1] = ColorForRating[rating.value];
	});

	return (
		<View style={{ width: '100%', flexDirection: 'row', paddingTop: 10 }}>
			{ratingsColors.map((color, index) => (
				<View
					key={index}
					style={{
						flex: 1,
						height: 15,
						backgroundColor: color,
						borderColor: 'white',
						borderWidth: 1,
					}}
				>
					<Text>{''}</Text>
				</View>
			))}
		</View>
	);
};

export const ReportUI = ({ route }: BottomTabScreenProps<RootStackParamList, 'ReportUI'>) => {
	const realm = useRealm();

	const isMonthly = route.params.monthly;

	const recuringEventSettings = getEventsSettings(realm);
	const recuringEventSettingsDict = {};
	recuringEventSettings.map((setting) => {
		recuringEventSettingsDict[setting.label] = setting;
	});

	const date = new Date(route.params.date);
	const { start_date, end_date } = computeMonthStartAndEndDate(date);

	const events = sumEventsForDateRange(start_date, end_date);

	// reset the date to 1rst of the month
	start_date.setDate(1);
	// Compute the time difference of two dates (in MS)
	let difference_in_time = end_date.getTime() - start_date.getTime();
	// Divide by the number of MS per day to compute the nb of days since the start
	let nb_of_days_since_month = difference_in_time / (1000 * 3600 * 24);

	const noticeable = getNoticeableEventsForDate(date) || [];

	return (
		<FooterNavigation>
			<View style={styles.wrapper}>
				<View style={styles.content}>
					<Text style={{ fontSize: 20, fontWeight: '600' }}>🔥 Congrats ! 🔥</Text>

					<DayRatingsReport date={date} />

					{[
						{ title: "You've done  💪", type: ACTIVITY_TYPES.Positive },
						{ title: 'But', type: ACTIVITY_TYPES.Negative },
					].map(({ title, type }) => {
						return (
							<View key={title}>
								<View
									style={{
										marginTop: 32,
										marginBottom: 8,
										flexDirection: 'row',
									}}
								>
									<Text style={{ fontSize: 16, fontWeight: '600' }}>{title}</Text>
								</View>

								{Object.entries(events).map(([label, sum]) => {
									if (recuringEventSettingsDict[label].type === type) {
										let hours,
											minutes,
											sign = '';

										if (recuringEventSettingsDict[label].target) {
											const adjustedTargetForMonth =
												recuringEventSettingsDict[label].target * nb_of_days_since_month;

											let diffToTarget = sum - adjustedTargetForMonth;

											// compute the sign before making sure value stay positive
											// so that the hours computation doesn't get affected by negative values
											sign = diffToTarget >= 0 ? '+' : '-';
											if (diffToTarget < 0) {
												diffToTarget *= -1;
											}

											hours = Math.floor(diffToTarget / 60);
											minutes = diffToTarget % 60;
										} else {
											hours = Math.floor(sum / 60);
											minutes = sum % 60;
										}

										return (
											<Text key={label}>
												{label}
												{': '}
												{sign}
												{hours > 0 && `${hours}h`}
												{minutes > 0 && `${minutes}m`}
											</Text>
										);
									}
								})}
							</View>
						);
					})}

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
							<ScrollView>
								{noticeable.map((event) => (
									<View key={event.value} style={{ flexDirection: 'row' }}>
										<Text style={{ textDecorationLine: 'underline' }}>
											{ddmmyyyy(new Date(event.date))}:
										</Text>
										<Text> {event.value}</Text>
									</View>
								))}
							</ScrollView>
						</View>
					</View>
				</View>
			</View>
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
