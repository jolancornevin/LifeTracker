import React, { useMemo } from 'react';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { StyleSheet, View, Text, ScrollView } from 'react-native';

import { RealmContext } from '../../models/main';
import {
	Event,
	NOTICEABLE_LABEL,
	RecuringNegativeEvents,
	TYPES,
} from '../../models/event';
import { ddmmyyyy, newDate } from '../../utils';
import { Header } from '../utils/header';
import { FooterNavigation } from '../utils/footer_navigation';
import { DayRating } from '../../models/DayRating';
import { ColorForRating } from '../day_rating/day_rating';
import { NextScreenButton } from '../utils/next_screen_button';

const { useRealm, useQuery } = RealmContext;

const computeMonthStartAndEndDate = (date: Date) => {
	let start_date = useMemo(() => {
		const d = newDate(
			date.getFullYear(),
			date.getMonth(),
			date.getDate() + 1,
		);
		d.setDate(1);

		return d;
	}, [date]);

	let end_date = useMemo(() => {
		const d = newDate(
			date.getFullYear(),
			date.getMonth(),
			date.getDate() + 1,
		);
		d.setDate(1);
		d.setMonth(d.getMonth() + 1);

		return d;
	}, [date]);

	return { start_date, end_date };
};

const getEventsForDate = (
	start_date: Date,
	end_date: Date,
	type: string,
): Record<string, number> => {
	let events = useQuery(Event).filtered(
		`date >= ${start_date.getTime()} and date < ${end_date.getTime()} and type = '${type}'`,
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

const getPositiveEvents = (date: Date) => {
	const { start_date, end_date } = computeMonthStartAndEndDate(date);
	return getEventsForDate(start_date, end_date, TYPES.Positive) || [];
};

const getNoticeableEventsForDate = (date: Date): Event[] => {
	const { start_date, end_date } = computeMonthStartAndEndDate(date);

	let events = useQuery(Event).filtered(
		`date >= ${start_date.getTime()} and date < ${end_date.getTime()} and type = '${
			TYPES.Noticeable
		}'`,
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

const getNegativeEvents = (date: Date) => {
	// start date is the beginning of the week
	let start_date = useMemo(() => {
		let d = newDate(
			date.getFullYear(),
			date.getMonth(),
			date.getDate() + 1,
		);
		d.setDate(d.getDate() - ((d.getDay() + 6) % 7));

		return d;
	}, [date]);

	// end date is now (+ 1 because the query is <)
	let end_date = useMemo(() => {
		const d = newDate(
			date.getFullYear(),
			date.getMonth(),
			date.getDate() + 1,
		);
		d.setDate(d.getDate() + 1);
		return d;
	}, [date]);

	// To calculate the time difference of two dates
	var Difference_In_Time = end_date.getTime() - start_date.getTime();

	// To calculate the no. of days between two dates
	var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

	return {
		negativeEvents:
			getEventsForDate(start_date, end_date, TYPES.Negative) || [],
		nbOfDaysSinceMonday: Difference_In_Days,
	};
};

type RootStackParamList = {
	ReportUI: {
		// useRealm: () => Realm;
		monthly: boolean;
		date: Date;
	};
};

export const DayRatingsReport = ({ date }: { date: Date }) => {
	const { start_date, end_date } = computeMonthStartAndEndDate(date);

	let dayRatings = useQuery(DayRating).filtered(
		`date >= ${start_date.getTime()} && date < ${end_date.getTime()}`,
	);

	// reset date to the current month, to get the number of days in the month
	end_date.setDate(end_date.getDate() - 1);

	let ratingsColors = Array.from(
		{ length: end_date.getDate() },
		() => 'transparent',
	);

	// now iterate over the ratings we have in the db and set the color
	dayRatings.forEach((rating) => {
		if (!rating.value) {
			return;
		}
		// date start at 1
		ratingsColors[new Date(rating.date).getDate() - 1] =
			ColorForRating[rating.value];
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

export const ReportUI = ({
	route,
}: BottomTabScreenProps<RootStackParamList, 'ReportUI'>) => {
	const isMonthly = route.params.monthly;

	const date = new Date(route.params.date);

	const events = getPositiveEvents(date);
	const { negativeEvents, nbOfDaysSinceMonday } = getNegativeEvents(date);
	const noticeable = getNoticeableEventsForDate(date) || [];

	return (
		<FooterNavigation>
			<View style={styles.wrapper}>
				<View style={styles.content}>
					<Text style={{ fontSize: 20, fontWeight: '600' }}>
						🔥 Congrats ! 🔥
					</Text>

					<DayRatingsReport date={date} />

					<View
						style={{
							marginTop: 32,
							marginBottom: 8,
							flexDirection: 'row',
						}}
					>
						<Text
							style={{
								fontSize: 16,
								fontWeight: '600',
							}}
						>
							You've done
						</Text>
						<Text
							style={{
								fontSize: 16,
								marginLeft: 8,
							}}
						>
							💪
						</Text>
					</View>
					{Object.entries(events).map(([label, value]) => {
						const hours = Math.floor((value as number) / 60);
						const minutes = (value as number) % 60;

						return (
							<Text key={label}>
								{label}
								{': '}
								{hours > 0 && `${hours}h`}
								{minutes > 0 && `${minutes}m`}
							</Text>
						);
					})}

					<Text
						style={{
							marginTop: 10,
							fontSize: 16,
							fontWeight: '600',
						}}
					>
						But:
					</Text>

					{Object.entries(negativeEvents).map(
						([label, computedValue]) => {
							let value =
								computedValue -
								RecuringNegativeEvents[label].target *
									nbOfDaysSinceMonday;

							// compute the sign before making sure value stay positive
							// so that the hours computation doesn't get affected by negative values
							const sign = value >= 0? '+': '-';
							if (value < 0) {
								value *= -1;
							}

							const hours = Math.floor(value / 60);
							const minutes = value % 60;

							return (
								<Text key={label}>
									{RecuringNegativeEvents[label].text}
									{': '}
									{sign}
									{`${hours}h`}
									{`${minutes}m`}
								</Text>
							);
						},
					)}

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
								{noticeable.map((event) => {
									return (
										<View
											key={event.value}
											style={{ flexDirection: 'row' }}
										>
											<Text
												style={{
													textDecorationLine:
														'underline',
												}}
											>
												{ddmmyyyy(new Date(event.date))}
												:
											</Text>
											<Text> {event.value}</Text>
										</View>
									);
								})}
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
