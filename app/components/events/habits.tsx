import * as React from 'react';

import { TouchableOpacity, View, Text } from 'react-native';

import { RealmContext } from '../../models/main';
import { Habits, HabitsList } from '../../models/habits';

const { useQuery } = RealmContext;

const getOrCreateHabitsForDate = (realm: Realm, label: string, date: Date): Habits => {
	let habits = useQuery(Habits).filtered(`date = ${date.getTime()} and label = ${label}`);

	if (habits.length === 0) {
		realm.write(() => {
			realm.create('Habits', {
				_id: new Realm.BSON.ObjectId(),
				date: date.getTime(),
				label: label,
				value: 0,
			});
		});
	}

	// re-run it outside of the if because react doesn't want hooks to be run in conditions...
	// It's ugly, but it's ok since it's a pretty quick query.
	habits = useQuery(Habits).filtered(`date = ${date.getTime()} and label = ${label}`);
	return habits[0];
};

const updateHabit = (realm: Realm, habit: Habits, value: number) => {
	realm.write(() => {
		habit.value += value;
	});
};

export const HabitsUI = ({ realm, date }: { date: Date; realm: Realm }) => {
	const habitsButton = (icon: string, label: string) => {
		const habit = getOrCreateHabitsForDate(realm, label, date);

		return (
			<View style={{ flexDirection: 'row' }}>
				<Text>{icon}</Text>
				<Text>{habit.value}</Text>
				<View style={{ flexDirection: 'column' }}>
					<TouchableOpacity
						key={label+'-'}
						style={{
							flex: 1,
							margin: 2,
							padding: 2,

							borderWidth: 1,
							borderRadius: 10,
							borderColor: 'grey',

							alignItems: 'center',
							justifyContent: 'center',
						}}
						onPress={() => {
							updateHabit(realm, habit, -1);
						}}
					>
						<Text>-</Text>
					</TouchableOpacity>
					<TouchableOpacity
						key={label+'+'}
						style={{
							flex: 1,
							margin: 2,
							padding: 2,
							paddingLeft: 10,

							borderWidth: 1,
							borderRadius: 10,
							borderColor: 'grey',

							alignItems: 'center',
							justifyContent: 'center',
						}}
						onPress={() => {
							updateHabit(realm, habit, 1);
						}}
					>
						<Text>+</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	};

	return (
		<>
			<View style={{ flexDirection: 'row' }}>
				{HabitsList.map(({icon, label}): JSX.Element => {
					return habitsButton(icon, label)
				})}
			</View>
		</>
	);
};
