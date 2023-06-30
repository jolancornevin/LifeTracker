import React, { useEffect } from 'react';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { StyleSheet, View, Text, Button, TextInput } from 'react-native';
import { Results } from 'realm';

import { RealmContext } from '../../models/main';
import { Event } from '../../models/event';
import { NOTICABLE_LABEL, ddmmyyyy, newDate, stringToDate } from '../../utils';
import { Header } from '../utils/header';
import { CalendarModal } from '../utils/calendar_modal';
import { FooterNavigation } from '../utils/footer_navigation';
import { NextScreenButton } from '../utils/next_screen_button';

const { useRealm, useQuery } = RealmContext;

type RootStackParamList = {
	EventUI: {
		// useRealm: () => Realm;
	};
};

enum RecuringEvent {
	Music = 'Music',
	Chess = 'Chess',
	Gym = 'Gym',
	Learning = 'Learning',
}

const getOrCreateEventForDate = (realm: Realm, date: Date): Record<string, Event> => {
	let events = useQuery(Event).filtered(`date = ${date.getTime()}`);

	if (events.length === 0) {
		realm.write(() => {
			Object.values(RecuringEvent).forEach((label) => {
				realm.create('Event', {
					_id: new Realm.BSON.ObjectId(),
					date: date.getTime(),
					label: label,
					value: '',
				});
			});

			realm.create('Event', {
				_id: new Realm.BSON.ObjectId(),
				date: date.getTime(),
				label: NOTICABLE_LABEL,
				value: '',
			});
		});
	}

	// re-run it outside of the if because react doesn't want hooks to be run in conditions...
	// It's ugly, but it's ok since it's a pretty quick query.
	events = useQuery(Event).filtered(`date = ${date.getTime()}`);

	let result = {};

	events.forEach((event: Event) => {
		result[event.label] = event;
	});

	return result;
};

const TextEntry = ({ label, value, onChange }) => {
	const [text, onChangeText] = React.useState(value);

	// for some reason, the text doesn't sync with the value automatically, so we have to do it this way :/
	useEffect(() => {
		setTimeout(() => {
			onChangeText(value)
		}, 100)
	}, [value])

	return (
		<View
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				paddingTop: 8,
			}}
		>
			<View style={{ width: 64 }}>
				<Text>{label + ':'}</Text>
			</View>
			<TextInput
				style={styles.input}
				onChangeText={(value) => {
					onChangeText(value);
					onChange(value);
				}}
				value={text}
				keyboardType={'numeric'}
			/>
		</View>
	);
};

export const EventUI = ({
	route,
}: BottomTabScreenProps<RootStackParamList, 'EventUI'>) => {
	const realm = useRealm();

	const [date, setDate] = React.useState(newDate());

	const events = getOrCreateEventForDate(realm, date);

	const [noticableText, onChangeNoticableText] = React.useState<string>(events[NOTICABLE_LABEL].value);
	useEffect(() => {
		setTimeout(() => {
			onChangeNoticableText(events[NOTICABLE_LABEL].value)
		}, 100)
	}, [events[NOTICABLE_LABEL]])

	return (
		<FooterNavigation>
			<View style={styles.wrapper}>
				<Header
					date={date}
					setDate={setDate}
				/>
				<View style={styles.content}>
					<Text style={{ fontSize: 16, fontWeight: '600' }}>
						Goals
					</Text>
					{Object.values(RecuringEvent).map((label) => {
						return (
							<TextEntry
								key={label}
								label={label}
								value={events[label].value}
								onChange={(value) => {
									realm.write(() => {
										events[label].value = value;
									});
								}}
							/>
						);
					})}

					<View
						style={{
							...styles.content,
							width: '100%',
						}}
					>
						<Text
							style={{
								fontSize: 16,
								fontWeight: '600',
							}}
						>
							Events
						</Text>

						<TextInput
							editable
							multiline
							onChangeText={(text) => {
								onChangeNoticableText(text);

								realm.write(() => {
									events[NOTICABLE_LABEL].value = text;
								});
							}}
							value={noticableText}
							style={{
								...styles.input,

								width: '100%',
								height: 100,
							}}
						/>
					</View>
				</View>
			</View>

			<NextScreenButton nextScreenName={'ReportUI'} params={{monthly: true}} />
		</FooterNavigation>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		alignItems: 'center',
	},
	content: {
		flex: 1,
		alignItems: 'center',
		width: '100%',
		paddingTop: 32,
	},
	input: {
		height: 30,
		width: 80,

		borderWidth: 1,
		borderRadius: 5,

		paddingLeft: 10,
		marginLeft: 10,
	},
});
