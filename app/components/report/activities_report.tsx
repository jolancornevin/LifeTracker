import React from 'react';

import { View, Text } from 'react-native';

import { RealmContext } from '../../models/main';
import { computeMonthStartAndEndDate, computeWeekStartAndEndDate } from '../../utils';
import { Event } from '../../models/event';
import { ACTIVITY_TYPES, getEventsSettings } from '../../models/event_settings';
import { HoursMinutes } from '../utils/hours_minutes';

const { useRealm, useQuery } = RealmContext;

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

export const ActivitiesReport = ({ date }: { date: Date }) => {
	const realm = useRealm();

	const recuringEventSettingsDict = Object.fromEntries(
		getEventsSettings(realm).map((setting) => [setting.label, setting]),
	);

	let { start_date: m_start_date, end_date: m_end_date } = computeMonthStartAndEndDate(date);
	m_end_date.setMonth(m_end_date.getMonth() - 1);
	m_start_date.setMonth(m_end_date.getMonth() - 1);
	const lastMonthActivities = sumEventsForDateRange(m_start_date, m_end_date);

	let { start_date: w_start_date, end_date: w_end_date } = computeWeekStartAndEndDate(date);
	const weekActivities = sumEventsForDateRange(w_start_date, w_end_date);

	let { start_date: lw_start_date, end_date: lw_end_date } = computeWeekStartAndEndDate(date);
	lw_start_date.setDate(lw_start_date.getDate() - 7);
	lw_end_date.setDate(lw_end_date.getDate() - 7);
	const lastWeekActivities = sumEventsForDateRange(lw_start_date, lw_end_date);

	let { start_date, end_date } = computeMonthStartAndEndDate(date);
	const monthlyActivities = sumEventsForDateRange(start_date, end_date);

	// reset the date to 1rst of the month
	start_date.setDate(1);
	// Compute the time difference of two dates (in MS)
	let difference_in_time = date.getTime() - start_date.getTime();
	// Divide by the number of MS per day to compute the nb of days since the start
	// add +1 because on the 1rst, the result is 0 and it's an issue for computations.
	let nb_of_days_since_month = difference_in_time / (1000 * 3600 * 24) + 1;

	return (
		<>
			{[
				{ title: "You've done  💪", type: ACTIVITY_TYPES.Positive },
				{ title: 'But', type: ACTIVITY_TYPES.Negative },
			].map(({ title, type }) => {
				return (
					<View key={title} style={{ width: '100%' }}>
						<View
							style={{
								marginTop: 32,
								marginBottom: 8,

								flexDirection: 'row',

								marginRight: 'auto',
								marginLeft: 'auto',
							}}
						>
							<Text style={{ fontSize: 16, fontWeight: '600' }}>{title}</Text>
						</View>

						<View
							style={{
								flexDirection: 'row',

								borderBottomWidth: 1,
								borderTopWidth: 1,
							}}
						>
							<View
								style={{
									flex: 3,
									alignItems: 'center',
									paddingLeft: 4,
									borderRightWidth: 1,
									borderLeftWidth: 1,
								}}
							>
								<Text style={{ fontWeight: '600' }}>Name</Text>
							</View>
							{/* <View style={{ flex: 1, alignItems: 'center', borderRightWidth: 1 }}>
								<Text style={{ fontWeight: '600' }}>Daily</Text>
							</View> */}
							<View style={{ flex: 2, alignItems: 'center', borderRightWidth: 1 }}>
								<Text style={{ fontWeight: '600' }}>Total (W)</Text>
							</View>
							<View style={{ flex: 2, alignItems: 'center', borderRightWidth: 1 }}>
								<Text style={{ fontWeight: '600' }}>Week -1</Text>
							</View>
							<View style={{ flex: 2, alignItems: 'center', borderRightWidth: 1 }}>
								<Text style={{ fontWeight: '600' }}>Total (M)</Text>
							</View>
							<View style={{ flex: 2, alignItems: 'center', borderRightWidth: 1 }}>
								<Text style={{ fontWeight: '600' }}>Month -1</Text>
							</View>
						</View>

						{Object.entries(recuringEventSettingsDict)
							.filter(([label, setting]) => setting.type === type)
							.map(([label, setting]) => {
								let monthlySum = monthlyActivities[label],
									dailySum = Math.floor(monthlySum / nb_of_days_since_month),
									weekSum = weekActivities[label],
									pastWeekSum = lastWeekActivities[label],
									pastMonthSum = lastMonthActivities[label],
									// current day
									dailyHours = Math.floor(dailySum / 60),
									dailyMinutes = dailySum % 60;

								return (
									<View
										key={label}
										style={{
											flexDirection: 'row',
											justifyContent: 'center',
											borderBottomWidth: 1,
										}}
									>
										<View
											style={{
												flex: 3,
												alignItems: 'flex-start',
												paddingLeft: 4,
												borderRightWidth: 1,
												borderLeftWidth: 1,
											}}
										>
											<Text>
												{label} ~ {dailyHours > 0 && `${dailyHours}h`}
												{dailyMinutes > 0 && `${dailyMinutes}m`}
											</Text>
										</View>
										<View style={{ flex: 2, alignItems: 'center', borderRightWidth: 1 }}>
											<HoursMinutes minutes={weekSum} />
										</View>
										<View style={{ flex: 2, alignItems: 'center', borderRightWidth: 1 }}>
											<HoursMinutes minutes={pastWeekSum} />
										</View>
										<View style={{ flex: 2, alignItems: 'center', borderRightWidth: 1 }}>
											<HoursMinutes minutes={monthlySum} />
										</View>
										<View style={{ flex: 2, alignItems: 'center', borderRightWidth: 1 }}>
											<HoursMinutes minutes={pastMonthSum} />
										</View>
									</View>
								);
							})}
					</View>
				);
			})}
		</>
	);
};
