import * as React from 'react';

import Realm from "realm";

import { Text, TouchableOpacity, View } from 'react-native';

import { DayRating } from '../../models/day_rating';
import { RealmContext } from '../../models/main';
import colors from '../../styles/colors';

const { useQuery } = RealmContext;

enum Rating {
	Bad = 'Bad',
	Neutral = 'Good',
	Awesome = 'Awesome',
}

const getOrCreateRatingForDate = (realm: Realm, date: Date): DayRating => {
	let rating = useQuery(DayRating).filtered(`date = ${date.getTime()}`);

	if (rating.length === 0) {
		realm.write(() => {
			realm.create('DayRating', {
				_id: new Realm.BSON.ObjectId(),
				date: date.getTime(),
				value: '',
			});
		});
	}

	// re-run it outside of the if because react doesn't want hooks to be run in conditions...
	// It's ugly, but it's ok since it's a pretty quick query.
	rating = useQuery(DayRating).filtered(`date = ${date.getTime()}`);
	return rating[0];
};

const updateRating = (realm: Realm, rating: DayRating, value: string) => {
	realm.write(() => {
		rating.value = value;
	});
};

export const ColorForRating = {
	[Rating.Bad]: 'red',
	[Rating.Neutral]: 'green',
	[Rating.Awesome]: 'gold',
};

export const DayRatingUI = ({ realm, date }: { date: Date; realm: Realm }) => {
	const rating = getOrCreateRatingForDate(realm, date);

	const ratingButton = React.useCallback((value: Rating) => {
		return (
			<TouchableOpacity
				key={value}
				style={{
					flex: 1,
					height: 70,
					margin: 10,
					padding: 10,

					borderWidth: 1,
					borderRadius: 10,
					borderColor: colors.grey,

					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: rating.value === value ? ColorForRating[value] : colors.white,
				}}
				onPress={() => {
					updateRating(realm, rating, value);
				}}
			>
				<Text
					style={{
						color: rating.value === value ? colors.white : ColorForRating[value],
					}}
				>
					{value}
				</Text>
			</TouchableOpacity>
		);
	}, [rating]);

	return (
		<>
			<View style={{ flexDirection: 'row' }}>
				{ratingButton(Rating.Bad)}
				{ratingButton(Rating.Neutral)}
				{ratingButton(Rating.Awesome)}
			</View>
		</>
	);
};
