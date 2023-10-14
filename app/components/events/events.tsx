import React, { useEffect, useMemo } from 'react';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { StyleSheet, View, Text, TextInput, Button, ScrollView } from 'react-native';

import { RealmContext } from '../../models/main';
import { getEventsForDate, getOrCreateNoticeableEventForDate, upsertEvent } from '../../models/event';
import { ACTIVITY_TYPES, getEventsSettings } from '../../models/event_settings';
import { FooterNavigation } from '../utils/footer_navigation';
import { NextScreenButton } from '../utils/next_screen_button';
import { EventTimer, createEventTimer, deleteEventTimer, getEventTimers } from '../../models/event_timer';

const { useRealm, useQuery } = RealmContext;

type RootStackParamList = {
	EventUI: {
		date: Date;
	};
};

const Timer = ({
	realm,
	label,

	onStop,
}: {
	realm: Realm;
	label: string;
	onStop: (value: number) => void;
}) => {
	const [existingTimer, onChangeExistingTimer] = React.useState<EventTimer | null>(getEventTimers(realm, label));
	const [timeDiff, onTimeDiffChange] = React.useState<number>(0);

	useEffect(() => {
		if (existingTimer) {
			const interval = setInterval(() => {
				onTimeDiffChange(Math.floor((new Date().getTime() - existingTimer.date) / 1000));
			}, 1000);
			return () => clearInterval(interval);
		}

		return () => {};
	}, [existingTimer]);

	if (!existingTimer) {
		return (
			<View
				style={{
					width: '100%',
				}}
			>
				<Button
					title={'Start'}
					color={'green'}
					onPress={() => {
						onChangeExistingTimer(createEventTimer(realm, label));
					}}
				/>
			</View>
		);
	}

	const minutes = Math.floor(timeDiff / 60),
		seconds = timeDiff % 60,
		timeDiffDisplay = (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);

	return (
		<View
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				paddingTop: 8,
			}}
		>
			<Button
				title={timeDiffDisplay}
				color={'blue'}
				onPress={() => {
					onStop(timeDiff);
					onChangeExistingTimer(null);
					deleteEventTimer(realm, existingTimer);
					onTimeDiffChange(0);
				}}
			/>
		</View>
	);
};

const TextEntry = ({
	realm,

	label,
	value,
	onChange,
	target,
}: {
	realm: Realm;
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

	const onValueChange = (value) => {
		onChangeText(value);
		onChange(value);
	};

	return (
		<View
			style={{
				width: '100%',
				flexDirection: 'row',
				alignItems: 'stretch',
				justifyContent: 'flex-start',
				paddingTop: 8,
			}}
		>
			<View style={{ flex: 1 }}>
				<Text>{label + ':'}</Text>
			</View>
			<View
				style={{ flex: 2, alignItems: 'center', flexDirection: 'row', marginLeft: 'auto', marginRight: 'auto' }}
			>
				<TextInput
					style={{
						width: 54,

						borderBottomWidth: 1,

						paddingLeft: 10,
						marginLeft: 10,
					}}
					onChangeText={onValueChange}
					value={text}
					keyboardType={'numeric'}
				/>
				<Text> minutes {target !== undefined ? `(${target})` : ''}</Text>
			</View>
			<View style={{ flex: 1, alignItems: 'flex-end' }}>
				<Timer
					realm={realm}
					label={label}
					onStop={(value) => onValueChange(Math.floor(value / 60).toString())}
				/>
			</View>
		</View>
	);
};

export const EventUI = ({ route }: BottomTabScreenProps<RootStackParamList, 'EventUI'>) => {
	const realm = useRealm();

	const recuringEventSettings = getEventsSettings(realm);

	const date = new Date(route.params.date);
	const events = getEventsForDate(realm, date);

	const noticeableEvent = getOrCreateNoticeableEventForDate(realm, date);
	const [noticableText, onChangeNoticeableText] = React.useState<string>(noticeableEvent.value);

	useEffect(() => {
		setTimeout(() => {
			onChangeNoticeableText(noticeableEvent.value);
		}, 100);
	}, [noticeableEvent]);

	return (
		<FooterNavigation>
			<ScrollView>
				<View style={styles.wrapper}>
					<View style={styles.content}>
						{[
							{ title: '-- Goals ✓ --', type: ACTIVITY_TYPES.Positive },
							{ title: '-- Goals ✗ --', type: ACTIVITY_TYPES.Negative },
						].map(({ title, type }) => {
							return (
								<View
									key={title}
									style={{
										marginBottom: 32,
									}}
								>
									<Text
										style={{
											fontSize: 16,
											fontWeight: '600',

											marginBottom: 16,

											marginLeft: 'auto',
											marginRight: 'auto',
										}}
									>
										{title}
									</Text>

									{recuringEventSettings
										.filter((eventSetting) => eventSetting.type === type)
										.map((eventSetting) => {
											const value = events[eventSetting.label]?.value || '';

											return (
												<TextEntry
													realm={realm}
													key={eventSetting.label}
													label={eventSetting.label}
													value={value}
													onChange={(value) => {
														events[eventSetting.label] = upsertEvent(
															realm,
															date,
															events[eventSetting.label],
															eventSetting.label,
															value,
															eventSetting.type,
														);
													}}
												/>
											);
										})}
								</View>
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
			</ScrollView>

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
		padding: 8,
	},
	content: {
		flex: 1,
		alignItems: 'center',
		width: '100%',
		paddingTop: 32,
	},
});
