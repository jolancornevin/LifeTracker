import React from 'react';

import { View, Text, Dimensions } from 'react-native';

import { RealmContext } from '../../models/main';
import { newDate } from '../../utils';
import { Event } from '../../models/event';
import { ACTIVITY_TYPES } from '../../models/event_settings';

const { useRealm, useQuery } = RealmContext;

const HEIGHT = 150;

export interface point {
	label: string;
	value: number;
}
interface eventValues {
	// map of date: (map of label: value)
	pointsByDate: Record<number, Record<string, number>>;
	orderedDates: number[];
	maxValueByLabel: Record<string, number>;
}

const pointsForDateRange = (start_date: Date, end_date: Date): eventValues => {
	let events = useQuery(Event).filtered(
		`date >= ${start_date.getTime()} and date < ${end_date.getTime()} and type != '${ACTIVITY_TYPES.Noticeable}'`,
	);

	const orderedDates = [];
	const maxValueByLabel = {};

	const d = newDate(start_date.getUTCFullYear(), start_date.getUTCMonth(), start_date.getUTCDate() + 1);
	// Compute the time difference of two dates (in MS)
	let difference_in_time = end_date.getTime() - start_date.getTime();
	// Divide by the number of MS per day to compute the nb of days since the start
	// add +1 because on the 1rst, the result is 0 and it's an issue for computations.
	let nb_of_daysh = difference_in_time / (1000 * 3600 * 24) + 1;

	let pointsByDate: Record<number, Record<string, number>> = {};
	for (let i = 0; i < nb_of_daysh; i++) {
		orderedDates.push(d.getUTCDate());
        pointsByDate[d.getUTCDate()] = {};

		d.setUTCDate(d.getUTCDate() + 1);
	}

	events.forEach((event: Event) => {
		if (!event.value) {
			return;
		}

		if (maxValueByLabel[event.label] === undefined) {
			maxValueByLabel[event.label] = 0;
		}
		if (event.value > maxValueByLabel[event.label]) {
			maxValueByLabel[event.label] = event.value;
		}

		pointsByDate[new Date(event.date).getUTCDate()][event.label] = parseInt(event.value);
	});

	return {
		pointsByDate,
		maxValueByLabel,
		orderedDates,
	};
};

function connect(div1Left, div1Top, div2Left, div2Top, xStart) {
	const thickness = 2;

	// bottom right
	var x1 = div1Left; // + div1Width;
	var y1 = div1Top; // + div1Height;
	// top right
	var x2 = div2Left; // + div2Width;
	var y2 = div2Top;
	// distance
	var length = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
	// center
	var cx = (x1 + x2) / 2 - length / 2;
	var cy = (y1 + y2) / 2 - thickness / 2;
	// angle
	var angle = Math.atan2(y1 - y2, x1 - x2) * (180 / Math.PI) * -1;
	// make hr

	console.log({ x1, y1, x2, y2 });
	console.log({ cx, cy, angle, length, start: ((180+angle)/100)  });

	return (
		<View
			style={{
				padding: 0,
				margin: 0,
				height: 1,
				backgroundColor: 'black',

				width: length,

				position: 'absolute',
				left: xStart + 5,
				bottom: cy + 15,
                transformOrigin: 'left',
				transform: [
                    {
                        translateX: (78-length)/2
                    },
                    {
                        translateY: (78-length)/2
                    },
                    {
                        rotate: `${angle}deg`
                    },
                    {
                        translateX: (78-length)/-2
                    },
                    {
                        translateY: (78-length)/-2
                    },
                ]
			}}
		></View>
	);
}

const colors = [
	'#881354',
	'#62683e',
	'#4c9974',
	'#1c0e0e',
	'#1a7b10',
	'#935b15',
	'#2e3a91',
	'#314b46',
	'#23d4c8',
	'#ee5c2a',
	'#8e2c0b',
	'#02136d',
	'#7d3f7a',
];

export const Chart = ({ date }: { date: Date }) => {
	const startDate = newDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1);
	startDate.setDate(date.getUTCDate() - 4);

	const { pointsByDate, maxValueByLabel, orderedDates } = pointsForDateRange(startDate, date);
    console.log({pointsByDate, maxValueByLabel, orderedDates})

	const labelToColor = {};
	let colorsCounter = 0;

	let nbCols = orderedDates.length;
	const windowWidth = Dimensions.get('window').width - 20; // TODO use margin
	const colWidth = windowWidth / nbCols;

	const view = (
		<>
			<View
				style={{
					//flex: 1,
					flexDirection: 'row',
					//alignItems: 'center',

					width: '100%',

					height: HEIGHT,

					borderColor: 'black',
					borderLeftWidth: 2,
					borderBottomWidth: 2,

					position: 'relative',
				}}
			>
				{orderedDates.map((_date, colNumber) => {
					return (
						<View
							key={_date}
							style={{
								width: colWidth,
								height: HEIGHT,
								position: 'relative',
							}}
						>
							{Object.entries(maxValueByLabel).map(([label, maxValue]) => {
									if (!labelToColor[label]) {
										labelToColor[label] = colors[colorsCounter++];
									}

                                    let currentPointValue = pointsByDate[_date][label] || 0;

									let nextPointValue: number = 0;
									if (colNumber < orderedDates.length - 1) {
										nextPointValue = pointsByDate[orderedDates[colNumber + 1]][label] || 0;
									}

                                    const leftPadding = (colWidth / 2) - 18;

									return (
										<>
											<View
												key={label}
												style={{
													position: 'absolute',
													bottom: 0,
													left: leftPadding,
												}}
											>
												<Text
													style={{
														fontWeight: 'bold',
														fontSize: 24,
														bottom: currentPointValue,

														color: labelToColor[label],
													}}
												>
													●
												</Text>
											</View>
											<>
												{/*connect(
														colWidth * colNumber + leftPadding,
														currentPointValue,
														colWidth * (colNumber + 1) + leftPadding,
														nextPointValue,
														leftPadding,
                                                )*/}
											</>
										</>
									);
							})}

							<View
								style={{
									position: 'absolute',
									left: colWidth / 2 - 15,
									width: '100%',
									bottom: -25,
								}}
							>
								<Text>{_date}</Text>
							</View>
						</View>
					);
				})}
			</View>
			<View
				style={{
					flex: 1,
					flexDirection: 'row',
					alignItems: 'center',
					bottom: -25,

					borderBottomWidth: 1,
				}}
			>
				{Object.keys(labelToColor).map((label) => (
					<Text style={{ color: labelToColor[label], paddingLeft: 16 }}>{label}</Text>
				))}
			</View>
		</>
	);

	return view;
};
