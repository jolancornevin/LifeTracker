import React, { useEffect } from 'react';

import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Event, getEventsForDate, getOrCreateNoticeableEventForDate, upsertEvent } from '../../models/event';
import { ACTIVITY_TYPES, getEventsSettings } from '../../models/event_settings';
import { RealmContext } from '../../models/main';
import { FooterNavigation } from '../utils/footer_navigation';
import { NavigationButtons } from '../utils/next_screen_button';
import { TextEntry } from './text_entry';
import { Counter } from './counter';
import { HeaderContext } from '../utils/header';

const { useRealm } = RealmContext;


const EventsSection = ({date}: { date: Date}) => {
	const realm = useRealm();
	
	const [noticableEvent, setNoticeableEvent] = React.useState<Event>();
	
	useEffect(() => {
		const noticeableEvent = getOrCreateNoticeableEventForDate(realm, date);

		setNoticeableEvent(noticeableEvent);
	}, [date.getTime()]);

	return (
		<View style={{ ...styles.content, alignItems: 'center', width: '100%', paddingTop: 16 }}>
			<Text style={{fontSize: 16, fontWeight: '600'}}>
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
						noticableEvent?.label || "",
						newText,
						noticableEvent?.type || "",
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

	)
}

export const EventUI = ({}) => {
	const realm = useRealm();

	const recuringEventSettings = getEventsSettings(realm);

	const { _date } = React.useContext(HeaderContext);
	const date = React.useMemo(() => new Date(_date), [_date]);

	const [events, setEvents] = React.useState<Record<string, Event>>({});

	useEffect(() => {
		const events = getEventsForDate(realm, date);
		setEvents(events);
	}, [date.getTime()]);

	return (
		<FooterNavigation>
			<>
				<ScrollView>
					<View style={styles.wrapper}>
						<View style={styles.content}>
							<Counter />

							{[
								{ title: '-- Goals ✓ --', type: ACTIVITY_TYPES.Positive },
								// { title: '-- Goals ✗ --', type: ACTIVITY_TYPES.Negative },
							].map(({ title, type }) => {
								return (
									<View
										key={title}
										style={{
											marginTop: 8,
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

															setEvents((oldEvents) => {
																return {
																	...oldEvents,
																	[eventSetting.label]: newEvent,
																};
															});
														}}
													/>
												);
											})}
									</View>
								);
							})}

							<EventsSection date={date} />
						</View>
					</View>
				</ScrollView>

				<NavigationButtons nextScreenName={'ReportUI'} />
			</>
		</FooterNavigation>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		// alignItems: 'center',
		// padding: 8,
		paddingHorizontal: 20,
	},
	content: {
		flex: 1,
		width: '100%',
	},
});
