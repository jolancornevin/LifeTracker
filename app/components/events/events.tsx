import React, { useEffect } from 'react';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { StyleSheet, View, Text, TextInput } from 'react-native';

import { RealmContext } from '../../models/main';
import { Event, NOTICEABLE_LABEL, RecuringNegativeEvents, RecuringPositiveEvents, TYPES } from '../../models/event';
import { FooterNavigation } from '../utils/footer_navigation';
import { NextScreenButton } from '../utils/next_screen_button';

const { useRealm, useQuery } = RealmContext;

type RootStackParamList = {
	EventUI: {
		date: Date;
	};
};

const getOrCreateEventsForDate = (
	realm: Realm,
	date: Date,
	listOfLabels: string[],
	type: string
): Record<string, Event> => {
	let events = useQuery(Event).filtered(`date = ${date.getTime()} and type = '${type}'`);

	if (events.length === 0) {
		realm.write(() => {
			listOfLabels.forEach((label) => {
				realm.create('Event', {
					_id: new Realm.BSON.ObjectId(),
					date: date.getTime(),
					label: label,
					value: '',
					type: type,
				});
			});
		});
	} else {
		// create any missing events
		let existingEvents = {};
		let existingEventsCount = 0;

		events.forEach((event: Event) => {
			existingEvents[event.label] = true;
			existingEventsCount += 1;
		});

		if (existingEventsCount != listOfLabels.length) {
			realm.write(() => {
				listOfLabels
					.filter((label) => !existingEvents[label])
					.forEach((label) => {
						realm.create('Event', {
							_id: new Realm.BSON.ObjectId(),
							date: date.getTime(),
							label: label,
							value: '',
							type: type,
						});
					});

				// no need to create noticeable since it has been there since the start
			});
		}
	}

	// re-run it outside of the if because react doesn't want hooks to be run in conditions...
	// It's ugly, but it's ok since it's a pretty quick query.
	events = useQuery(Event).filtered(`date = ${date.getTime()} and type = '${type}'`);

	let result = {};

	events.forEach((event: Event) => {
		result[event.label] = event;
	});

	return result;
};

const getOrCreateNoticeableEventForDate = (realm: Realm, date: Date): Event => {
	let events = useQuery(Event).filtered(
		`date = ${date.getTime()} and label = '${NOTICEABLE_LABEL}'`,
	);

	if (events.length === 0) {
		realm.write(() => {
			realm.create('Event', {
				_id: new Realm.BSON.ObjectId(),
				date: date.getTime(),
				label: NOTICEABLE_LABEL,
				value: '',
				type: TYPES.Noticeable
			});
		});
	}

	// re-run it outside of the if because react doesn't want hooks to be run in conditions...
	// It's ugly, but it's ok since it's a pretty quick query.
	events = useQuery(Event).filtered(
		`date = ${date.getTime()} and label = '${NOTICEABLE_LABEL}'`,
	);
	return events[0];
};

const TextEntry = ({
	label,
	value,
	onChange,
	target,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
	target?: number;
}) => {
	const [text, onChangeText] = React.useState(value);

	// for some reason, the text doesn't sync with the value automatically, so we have to do it this way :/
	useEffect(() => {
		setTimeout(() => {
			onChangeText(value);
		}, 100);
	}, [value]);

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
				style={{
					width: 54,

					borderBottomWidth: 1,

					paddingLeft: 10,
					marginLeft: 10,
				}}
				onChangeText={(value) => {
					onChangeText(value);
					onChange(value);
				}}
				value={text}
				keyboardType={'numeric'}
			/>
			<Text> minutes {target !== undefined ? `(${target})` : ''}</Text>
		</View>
	);
};

export const EventUI = ({
	route,
}: BottomTabScreenProps<RootStackParamList, 'EventUI'>) => {
	const realm = useRealm();
	const date = new Date(route.params.date);

	const positiveEvents = getOrCreateEventsForDate(
		realm,
		date,
		Object.values(RecuringPositiveEvents),
		TYPES.Positive
	);

	const negativeEvents = getOrCreateEventsForDate(
		realm,
		date,
		Object.keys(RecuringNegativeEvents),
		TYPES.Negative
	);

	const noticeableEvent = getOrCreateNoticeableEventForDate(realm, date);

	const [noticableText, onChangeNoticeableText] = React.useState<string>(
		noticeableEvent.value,
	);
	useEffect(() => {
		setTimeout(() => {
			onChangeNoticeableText(noticeableEvent.value);
		}, 100);
	}, [noticeableEvent]);

	return (
		<FooterNavigation>
			<View style={styles.wrapper}>
				<View style={styles.content}>
					<Text style={{ fontSize: 16, fontWeight: '600' }}>
						Goals ✓
					</Text>
					{Object.values(RecuringPositiveEvents).map((label) => {
						return (
							<TextEntry
								key={label}
								label={label}
								value={positiveEvents[label].value}
								onChange={(value) => {
									realm.write(() => {
										positiveEvents[label].value = value;
									});
								}}
							/>
						);
					})}

					<Text
						style={{
							fontSize: 16,
							fontWeight: '600',
							marginTop: 32,
						}}
					>
						Goals ✗
					</Text>
					{Object.keys(RecuringNegativeEvents).map((key) => {
						const event = negativeEvents[key];
						return (
							<TextEntry
								key={RecuringNegativeEvents[key].text}
								label={RecuringNegativeEvents[key].text}
								value={negativeEvents[event.label].value}
								onChange={(value) => {
									realm.write(() => {
										negativeEvents[event.label].value =
											value;
									});
								}}
								target={RecuringNegativeEvents[key].target}
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
								onChangeNoticeableText(text);

								realm.write(() => {
									noticeableEvent.value = text;
								});
							}}
							value={noticableText}
							style={{
								width: '100%',
								height: 100,

								borderWidth: 1,
								borderRadius: 5,

								paddingLeft: 10,
								marginLeft: 10,
							}}
						/>
					</View>
				</View>
			</View>

			<NextScreenButton
				nextScreenName={'ReportUI'}
				params={{
					date: date.toJSON(),
					monthly: true,
				}}
			/>
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
});
