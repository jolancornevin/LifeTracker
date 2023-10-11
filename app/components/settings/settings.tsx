import React from 'react';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { StyleSheet, View, Button, TextInput, Text } from 'react-native';
import { RealmContext } from '../../models/main';
import { FooterNavigation } from '../utils/footer_navigation';
import { ExportToEmail } from '../../models/exporter';
import { getEventsSettings } from '../../models/event_settings';

const { useRealm } = RealmContext;

type RootStackParamList = {
	SettingsUI: {
		// useRealm: () => Realm;
	};
};

export const SettingsUI = ({ route }: BottomTabScreenProps<RootStackParamList, 'SettingsUI'>) => {
	const realm = useRealm();

	const recuringEventSettings = getEventsSettings(realm);

	const [eventName, setEventName] = React.useState<string>('');
	const [eventType, setEventType] = React.useState<string>('');
	const [realmText, setRealmText] = React.useState<string>('');
	const [done, setDone] = React.useState(false);

	return (
		<FooterNavigation>
			<View
				style={{
					flex: 1,
					paddingTop: 20,
					paddingHorizontal: 20,
				}}
			>
				<Text
					style={{
						fontSize: 16,
						fontWeight: '600',

						marginLeft: 'auto',
						marginRight: 'auto',
					}}
				>
					Current events
				</Text>
				{recuringEventSettings.map((event) => (
					<View key={event.label}>
						<Text>
							{event.label} - {event.type}: {event.target}
						</Text>
					</View>
				))}

				<Text
					style={{
						fontSize: 16,
						fontWeight: '600',

						marginLeft: 'auto',
						marginRight: 'auto',

						marginTop: 16,
					}}
				>
					Add new stuff
				</Text>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'stretch',
						justifyContent: 'flex-start',
					}}
				>
					<Text>Label:</Text>
					<TextInput
						style={{
							width: 54,

							borderBottomWidth: 1,

							paddingLeft: 10,
							marginLeft: 10,
						}}
						editable
						multiline
						onChangeText={setEventName}
						value={eventName}
					/>

					{/** add select of type */}

					<Text>Target:</Text>
					<TextInput
						style={{
							width: 54,

							borderBottomWidth: 1,

							paddingLeft: 10,
							marginLeft: 10,
						}}
						editable
						multiline
						onChangeText={setEventType}
						value={eventType}
					/>
					<Button title={'Add'} />
				</View>

				<View style={{ paddingTop: 56 }}>
					<Text
						style={{
							fontSize: 16,
							fontWeight: '600',

							marginLeft: 'auto',
							marginRight: 'auto',

							marginTop: 16,
						}}
					>
						Export/Import
					</Text>
					<Button
						title={'Export'}
						color={'green'}
						onPress={() => {
							ExportToEmail(
								realm,
								(result) => {
									console.log('ok', { result });
								},
								(error) => {
									console.log('ko', { error });
								},
							);
						}}
					/>
				</View>

				<View style={{ paddingTop: 20 }}>
					<TextInput
						editable
						multiline
						onChangeText={setRealmText}
						value={realmText}
						style={{
							height: 100,
							width: '100%',

							borderWidth: 1,
							borderRadius: 5,

							paddingBottom: 5,
						}}
					/>

					<Button
						title={'Import'}
						onPress={() => {
							const values = JSON.parse(realmText);

							realm.write(() => {
								realm.deleteAll();

								['EventSettings', 'Event', 'DayRating'].map((type) => {
									values[type].forEach((obj) => {
										realm.create(type, obj);
									});
								});

								setDone(true);
							});
						}}
					/>
				</View>

				<Text>{done && 'done'}</Text>
			</View>
		</FooterNavigation>
	);
};
