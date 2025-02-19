import React, { useEffect, useRef } from 'react';

import { Text, View } from 'react-native';

import { Event } from '../../models/event';
import { ACTIVITY_TYPES, EventSettings, getEventsSettings } from '../../models/event_settings';
import { RealmContext } from '../../models/main';
import { computeMonthStartAndEndDate, computeWeekStartAndEndDate, newDate } from '../../utils';
import { HoursMinutes } from '../utils/hours_minutes';
import { Chart } from './chart';

const { useRealm, useQuery } = RealmContext;

const sumEventsForDateRange = (startDate: Date, endDate: Date): Record<string, number> => {
	let events = useQuery(Event).filtered(
		`date >= ${startDate.getTime()} and date < ${endDate.getTime()} and type != '${ACTIVITY_TYPES.Noticeable}'`,
	);

	let result: Record<string, number> = {};

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

export const ActivitiesReport = ({
	date,
	recuringEventSettingsDict,
}: {
	date: Date;
	recuringEventSettingsDict: {
		[k: string]: EventSettings;
	};
}) => {
	let { startDate: m_start_date, endDate: m_end_date } = computeMonthStartAndEndDate(date);
	m_start_date.setFullYear(2020, 0, 0); // get ALL the data
	const totalActivities = sumEventsForDateRange(m_start_date, m_end_date);

	let { startDate: w_start_date, endDate: w_end_date } = computeWeekStartAndEndDate(date);
	const weekActivities = sumEventsForDateRange(w_start_date, w_end_date);

	let { startDate: lw_start_date, endDate: lw_end_date } = computeWeekStartAndEndDate(date);
	lw_start_date.setDate(lw_start_date.getUTCDate() - 7);
	lw_end_date.setDate(lw_end_date.getUTCDate() - 7);
	const previousWeekActivities = sumEventsForDateRange(lw_start_date, lw_end_date);

	let { startDate: month_start_date, endDate: month_end_date } = computeMonthStartAndEndDate(date);
	const monthlyActivities = sumEventsForDateRange(month_start_date, month_end_date);

	// reset the date to 1rst of the month
	month_start_date.setDate(1);
	// Compute the time difference of two dates (in MS)
	let difference_in_time = date.getTime() - month_start_date.getTime();
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
					<View key={title} style={{ width: '100%', padding: 8 }}>
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
									flex: 2,
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
								<Text style={{ fontWeight: '600' }}>Avg (M)</Text>
							</View>
							<View style={{ flex: 2, alignItems: 'center', borderRightWidth: 1 }}>
								<Text style={{ fontWeight: '600' }}>Total (W)</Text>
							</View>
							<View style={{ flex: 2, alignItems: 'center', borderRightWidth: 1 }}>
								<Text style={{ fontWeight: '600' }}>Week -1</Text>
							</View>
							<View style={{ flex: 2, alignItems: 'center', borderRightWidth: 1 }}>
								<Text style={{ fontWeight: '600' }}>Total</Text>
							</View>
						</View>

						{Object.entries(recuringEventSettingsDict)
							.filter(([label, setting]) => setting.type === type)
							.map(([label, setting]) => {
								let monthlySum = monthlyActivities[label],
									dailySum = Math.floor(monthlySum / nb_of_days_since_month),
									weekSum = weekActivities[label],
									totalSum = totalActivities[label],
									pastWeekSum = previousWeekActivities[label];

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
												flex: 2,
												alignItems: 'flex-start',
												paddingLeft: 4,
												borderRightWidth: 1,
												borderLeftWidth: 1,
											}}
										>
											<Text>
												{label}
											</Text>
										</View>
										<View style={{ flex: 2, alignItems: 'center', borderRightWidth: 1 }}>
											<HoursMinutes minutes={dailySum} />
										</View>
										<View style={{ flex: 2, alignItems: 'center', borderRightWidth: 1 }}>
											<HoursMinutes minutes={weekSum} />
										</View>
										<View style={{ flex: 2, alignItems: 'center', borderRightWidth: 1 }}>
											<HoursMinutes minutes={pastWeekSum} />
										</View>
										<View style={{ flex: 2, alignItems: 'center', borderRightWidth: 1 }}>
											<HoursMinutes minutes={totalSum} />
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
