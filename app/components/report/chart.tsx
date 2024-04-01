import React from 'react';

import { View, Text, Dimensions } from 'react-native';

import { RealmContext } from '../../models/main';
import { computeMonthStartAndEndDate, computeWeekStartAndEndDate, newDate } from '../../utils';
import { Event } from '../../models/event';
import { ACTIVITY_TYPES } from '../../models/event_settings';

import PureChart from 'react-native-pure-chart';

const { useRealm, useQuery } = RealmContext;

interface point {
	x: string;
	y: number;
}

interface eventValues {
	seriesName: string;
	color: string;
	data: point[];
}

const colors = [
	'#e6194b',
	'#3cb44b',
	'#4363d8',
	'#f58231',
	'#911eb4',
	'#46f0f0',
	'#f032e6',
	'#bcf60c',
	'#fabebe',
	'#008080',
	'#e6beff',
	'#9a6324',
	'#fffac8',
	'#800000',
	'#aaffc3',
	'#808000',
	'#ffd8b1',
	'#000075',
	'#808080',
	'#ffffff',
	'#000000',
];

	// ---------------------------

	/**
	 *
	 * @param start_date
	 * @param end_date
	 * @returns [
		{
			seriesName: 'series1',
			data: [
				{ x: '2018-02-01', y: 30 },
				{ x: '2018-02-02', y: 200 },
			],
			color: '#297AB1',
		},..
	];
	 */
	const pointsForDateRange = ( date: Date, eventsLabels: string[] ) => {
		// todo, get past 30days
		let { start_date: m_start_date, end_date: m_end_date } = computeMonthStartAndEndDate(date);

		const labelToData: Record<string, eventValues> = {};
		const labelToDateToData = {};
		eventsLabels.forEach((label, i) => {
			labelToData[label] = {
				seriesName: label,
				color: colors[i],
				data: [],
			};
			labelToDateToData[label] = {};
		});

		// iterate over the dates one by one so that we have data for every date
		for (
			let currentDate = m_start_date;
			currentDate <= m_end_date;
			currentDate.setDate(currentDate.getUTCDate() + 1)
		) {
			const events = useQuery(Event).filtered(
				`date = ${currentDate.getTime()} and type != '${ACTIVITY_TYPES.Noticeable}'`,
			);

			// get the data we have
			events.forEach((event: Event) => {
				if (!event.value) {
					return;
				}

				labelToDateToData[event.label][currentDate.toDateString()] = parseInt(event.value);
			});

			// for all events label (so even if no today data), we go add a point and we set it to 0 if no data.
			eventsLabels.forEach((label, i) => {
				labelToData[label].data.push({
					x: currentDate.getUTCDate().toString(),
					y: labelToDateToData[label][currentDate.toDateString()] ?? 0,
				});
			});
		}

		return Object.values(labelToData);
	};


export const Chart = ({ date, eventsLabels }: { date: Date; eventsLabels: string[] }) => {

	let data = pointsForDateRange( date, eventsLabels);

	return (
		<>
			<PureChart data={data} type="line" />
			<View style={{ flex: 1, flexDirection: 'row' }}>
				{data.map((d) => (
					<Text key={d.seriesName} style={{ color: d.color, paddingRight: 8 }}>{d.seriesName}</Text>
				))}
			</View>
		</>
	);
};
