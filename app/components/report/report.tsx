import React, { useMemo } from 'react';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { StyleSheet, View, Text, ScrollView } from 'react-native';

import { RealmContext } from '../../models/main';
import { Event } from '../../models/event';
import { NOTICABLE_LABEL, newDate } from '../../utils';
import { Header } from '../utils/header';
import { FooterNavigation } from '../utils/footer_navigation';
import { DayRating } from '../../models/DayRating';
import { ColorForRating } from '../day_rating/day_rating';
import { NextScreenButton } from '../utils/next_screen_button';

const { useRealm, useQuery } = RealmContext;

const getEventsForDate = (
	start_date: Date,
	end_date: Date,
): Record<string, number | Event[]> => {
	let events = useQuery(Event).filtered(
		`date >= ${start_date.getTime()} && date < ${end_date.getTime()}`,
	);

	let result = {};

	events.forEach((event: Event) => {
		if (!event.value) {
			return;
		}

		if (event.label === NOTICABLE_LABEL) {
			if (!result[event.label]) {
				result[event.label] = [];
			}
			result[event.label].push(event);
		} else {
			if (!result[event.label]) {
				result[event.label] = 0;
			}
			result[event.label] += parseInt(event.value);
		}
	});

	return result;
};

type RootStackParamList = {
	ReportUI: {
		// useRealm: () => Realm;
		monthly: boolean;
		date: Date,
	};
};

export const DayRatingsReport = ({
	start_date,
	end_date,
}: {
	start_date: Date;
	end_date: Date;
}) => {
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

	const [date, setDate] = React.useState(new Date(route.params.date));

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

	const events = getEventsForDate(start_date, end_date) || [];

	return (
		<FooterNavigation>
			<View style={styles.wrapper}>
				<View style={styles.content}>
					<Text style={{ fontSize: 16, fontWeight: '600' }}>
						Congrats ! 🎉
					</Text>

					<DayRatingsReport
						start_date={start_date}
						end_date={end_date}
					/>

					<Text style={{ fontWeight: '600', paddingTop: 32 }}>
						This month, you've accumulated:
					</Text>
					{Object.entries(events).map(([label, value]) => {
						if (label !== NOTICABLE_LABEL) {
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
						}
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
							}}
						>
							Noticable
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
								{NOTICABLE_LABEL in events &&
									(events[NOTICABLE_LABEL] as Event[]).map(
										(event) => {
											return (
												<Text key={event.value}>
													{event.date}: {event.value}
												</Text>
											);
										},
									)}
							</ScrollView>
						</View>
					</View>
				</View>
			</View>
			<NextScreenButton
				nextScreenName={null}
				params={{
					date: date.toJSON()
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
