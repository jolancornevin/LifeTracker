import React from 'react';

import { Text, View } from 'react-native';

import { DayRating } from '../../models/day_rating';
import { RealmContext } from '../../models/main';
import { computeMonthStartAndEndDate } from '../../utils';
import { ColorForRating } from '../events/day_rating';

const { useQuery } = RealmContext;

export const DayRatingsReport = ({ date }: { date: Date }) => {
	const { startDate, endDate } = computeMonthStartAndEndDate(date);

	const dayRatings = useQuery(DayRating).filtered(`date >= ${startDate.getTime()} && date < ${endDate.getTime()}`);

	// reset date to the current month, to get the number of days in the month
	endDate.setDate(endDate.getUTCDate() - 1);
	const ratingsColors = Array.from({ length: endDate.getUTCDate() }, () => 'transparent');

	// now iterate over the ratings we have in the db and set the color
	dayRatings.forEach((rating) => {
		if (!rating.value) {
			return;
		}

		// date start at 1
		ratingsColors[new Date(rating.date).getUTCDate() - 1] = ColorForRating[rating.value];
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
