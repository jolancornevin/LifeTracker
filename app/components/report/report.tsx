import React, { useCallback, useMemo } from 'react';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { StyleSheet, View, Text, Button, TextInput } from 'react-native';
import { Results } from 'realm';

import { RealmContext } from '../../models/main';
import { Event } from '../../models/event';
import { NOTICABLE_LABEL, ddmmyyyy, newDate, stringToDate } from '../../utils';
import { Header } from '../utils/header';
import { CalendarModal } from '../utils/calendar_modal';
import { FooterNavigation } from '../utils/footer_navigation';

const { useRealm, useQuery } = RealmContext;

const getEventsForDate = (
	start_date: Date,
	end_date: Date,
): Record<string, number | Event[]> => {
	let events = useQuery(Event).filtered(
		`date > ${start_date.getTime()} && date < ${end_date.getTime()}`,
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
			console.log(event.value)
			result[event.label] += parseInt(event.value);
		}
	});

	return result;
};

type RootStackParamList = {
	ReportUI: {
		// useRealm: () => Realm;
		monthly: boolean;
	};
};

export const ReportUI = ({
	route,
}: BottomTabScreenProps<RootStackParamList, 'ReportUI'>) => {
	const isMonthly = route.params.monthly;

	const [date, setDate] = React.useState(newDate());

	let start_date = newDate();
	start_date.setDate(1);

	let end_date = newDate();
	end_date.setDate(1);
	if (end_date.getMonth() === 12) {
		end_date.setMonth(0);
		end_date.setFullYear(end_date.getFullYear() + 1);
	} else {
		end_date.setMonth(end_date.getMonth() + 1);
	}

	const events = getEventsForDate(start_date, end_date);

	return (
		<FooterNavigation>
			<View style={styles.wrapper}>
				<Header date={date} setDate={setDate} />
				<View style={styles.content}>
					<Text style={{ fontSize: 16, fontWeight: '600' }}>GG</Text>
					<Text style={{ fontWeight: '600' }}>
						This month, you've accumulated:
					</Text>
					{Object.entries(events).map(([label, value]) => {
						if (label !== NOTICABLE_LABEL) {
							return (
								<>
									<Text>
										{label}{":"} {value as number}
									</Text>
								</>
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
						{(events[NOTICABLE_LABEL] as Event[]).map((event) => {
							return (
								<>
									<Text>
										{event.value}
									</Text>
								</>
							);
						})}
					</View>
				</View>
			</View>
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
