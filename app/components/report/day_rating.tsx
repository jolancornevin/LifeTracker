import React from 'react';

import { View, Text } from 'react-native';

import { RealmContext } from '../../models/main';
import { computeMonthStartAndEndDate } from '../../utils';
import { DayRating } from '../../models/day_rating';
import { ColorForRating } from '../events/day_rating';

const { useQuery } = RealmContext;

export const DayRatingsReport = ({ date }: { date: Date }) => {
	const { start_date, end_date } = computeMonthStartAndEndDate(date);

	const dayRatings = useQuery(DayRating).filtered(`date >= ${start_date.getTime()} && date < ${end_date.getTime()}`);

	// reset date to the current month, to get the number of days in the month
	end_date.setDate(end_date.getUTCDate() - 1);
	const ratingsColors = Array.from({ length: end_date.getUTCDate() }, () => 'transparent');

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
