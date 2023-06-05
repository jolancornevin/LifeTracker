import * as React from 'react';

import { TouchableOpacity, View, Text } from 'react-native';

import { TaskRealmContext } from '../../models';
import { DayRating } from '../../models/DayRating';

import { styles } from './styles';

const { useRealm, useQuery } = TaskRealmContext;

enum Rating {
	Bad = 'Bad',
	Good = 'Good',
	Great = 'Great',
	Awesome = 'Awesome',
}

const getOrCreateRatingForDate = (realm: Realm, date: string): DayRating => {
	let rating = useQuery(DayRating).filtered(`date = "${date}"`);

	if (rating.length === 0) {
		realm.write(() => {
			realm.create('DayRating', {
				_id: new Realm.BSON.ObjectId(),
				date: date,
				value: '',
			});
		});
	}

	// re-run it outside of the if because react doesn't want hooks to be run in conditions...
	// It's ugly, but it's ok since it's a pretty quick query.
	rating = useQuery(DayRating).filtered(`date = "${date}"`);
	return rating[0];
};

const updateRating = (realm: Realm, rating: DayRating, value: string) => {
	realm.write(() => {
		rating.value = value;
	});
};

const colorForRating = {
	[Rating.Bad]: 'red',
	[Rating.Good]: '#6cc857',
	[Rating.Great]: 'green',
	[Rating.Awesome]: 'gold',
};

export const DayRatingUI = ({
	realm,
	date,
}: {
	date: string;
	realm: Realm;
}) => {
	const rating = getOrCreateRatingForDate(realm, date);

	return (
		<View
			style={{
				flexDirection: 'row',
			}}
		>
			{Object.values(Rating).map((value) => {
				return (
					<TouchableOpacity
						key={value}
						style={{
							flex: 1,
							alignItems: 'center',
							backgroundColor:
								rating.value === value ? colorForRating[value] : 'white',
							padding: 10,
						}}
						onPress={() => {
							updateRating(realm, rating, value);
						}}
					>
						<Text
							style={{
								color:
									rating.value === value ? 'white' : colorForRating[value],
							}}
						>
							{value}
						</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);
};
