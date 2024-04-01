import React, { useMemo } from 'react';

import { View, Text, Dimensions } from 'react-native';

import { RealmContext } from '../../models/main';
import {
	DDMMyyyy,
	computeMonthStartAndEndDate,
	computePast30dDate,
	computeWeekStartAndEndDate,
	copyDate,
	newDate,
} from '../../utils';
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
	 * @param startDate
	 * @param endDate
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
const pointsForDateRange = (events: Realm.Results<Event>, startDate: Date, endDate: Date,eventsLabels: string[]) => {
	const labelToData: Record<string, eventValues> = {};
	const labelToDateAndData = {};

	eventsLabels.forEach((label, i) => {
		labelToData[label] = {
			seriesName: label,
			color: colors[i],
			data: [],
		};
		labelToDateAndData[label] = {};
	});


	// iterate over the events and store the dates and values we have values for
	events.forEach((event: Event) => {
		if (!event.value) {
			return;
		}

		if (!labelToData[event.label]) {
			return;
		}

		labelToDateAndData[event.label][new Date(event.date).toDateString()] = parseInt(event.value) ?? 0;
	});

	// iterate over the dates one by one in order to have data for every dates.
	for (
		let currentDate = startDate;
		currentDate <= endDate;
		currentDate.setDate(currentDate.getUTCDate() + 1)
	) {
		eventsLabels.forEach((label, i) => {
			labelToData[label].data.unshift({
				// take the data we have, or 0
				y: labelToDateAndData[label][new Date(currentDate).toDateString()] ?? 0,
				x: DDMMyyyy(currentDate),
			});
		});
	}

	// transform that map of labels to an array and fiter out values without data;
	return Object.values(labelToData).filter((v) => v.data.length > 0);
};

export const Chart = ({ date, eventsLabels }: { date: Date; eventsLabels: string[] }) => {
	let { startDate, endDate } = computePast30dDate(date);

	let events = useQuery(Event).filtered(
		`date >= ${startDate.getTime()} and date < ${endDate.getTime()} and type != '${ACTIVITY_TYPES.Noticeable}'`,
	);

	let data = useMemo(() => pointsForDateRange(events, startDate, endDate, eventsLabels), [date, events]);

	return (
		<>
			<PureChart data={data} type="line" height={150} />
			<View style={{ flex: 1, flexDirection: 'row' }}>
				{data.map((d) => (
					<Text key={d.seriesName} style={{ color: d.color, paddingRight: 8 }}>
						{d.seriesName}
					</Text>
				))}
			</View>
		</>
	);
};
