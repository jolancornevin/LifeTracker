import React, { useEffect, useMemo } from 'react';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { StyleSheet, View, Text, TextInput, ScrollView } from 'react-native';

import { RealmContext } from '../../models/main';
import { getEventsForDate, getOrCreateNoticeableEventForDate, upsertEvent, Event } from '../../models/event';
import { ACTIVITY_TYPES, getEventsSettings } from '../../models/event_settings';
import { FooterNavigation } from '../utils/footer_navigation';
import { NextScreenButton } from '../utils/next_screen_button';
import { TextEntry } from './text_entry';
import { DayRating } from '../../models/day_rating';
import { DayRatingUI } from './day_rating';
import { HabitsUI } from './habits';

const { useRealm } = RealmContext;

type RootStackParamList = {
	EventUI: {
		date: Date;
	};
};

export const EventUI = ({ route }: BottomTabScreenProps<RootStackParamList, 'EventUI'>) => {
	const realm = useRealm();

	const recuringEventSettings = getEventsSettings(realm);

	const date = new Date(route.params.date);

	const [events, setEvents] = React.useState<Record<string, Event>>([]);
	const [noticableEvent, setNoticeableEvent] = React.useState<Event>();

	useEffect(() => {
		const events = getEventsForDate(realm, date);
		setEvents(events);

		const noticeableEvent = getOrCreateNoticeableEventForDate(realm, date);

		setNoticeableEvent(noticeableEvent);
	}, [date.getTime()]);

	return (
		<FooterNavigation>
			<ScrollView>
				<View style={styles.wrapper}>
					<View style={styles.content}>
						<DayRatingUI realm={realm} date={date} />
						<HabitsUI realm={realm} date={date} />

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
													key={`${eventSetting.label}-${value}`}
													label={eventSetting.label}
													value={value}
													onChange={(newValue) => {
														const newEvent = upsertEvent(
															realm,
															date,
															events[eventSetting.label],
															eventSetting.label,
															newValue,
															eventSetting.type,
														);

														setEvents((oldEvents) => ({
															...oldEvents,
															[eventSetting.label]: newEvent,
														}));
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
								onChangeText={(newText) => {
									const newEvent = upsertEvent(
										realm,
										date,
										noticableEvent,
										noticableEvent.label,
										newText,
										noticableEvent.type,
									);

									setNoticeableEvent(newEvent);
								}}
								value={noticableEvent?.value || ''}
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
