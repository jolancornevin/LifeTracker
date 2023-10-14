import React from 'react';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { StyleSheet, View, Button, TextInput, Text } from 'react-native';
import { RealmContext } from '../../models/main';
import { FooterNavigation } from '../utils/footer_navigation';
import { ExportToEmail } from '../../models/exporter';
import { getEventsSettings } from '../../models/event_settings';
import { ImportExport } from './import_export';

const { useRealm } = RealmContext;

export const ActivitiesSettings = () => {
	const realm = useRealm();

	const recuringEventSettings = getEventsSettings(realm);

	const [eventName, setEventName] = React.useState<string>('');
	const [eventType, setEventType] = React.useState<string>('');

	return (
		<>
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
				<View
					key={event.label}
					style={{
						flexDirection: 'row',
						alignItems: 'stretch',
						justifyContent: 'flex-start',
					}}
				>
					<View style={{ flex: 4 }}>
						<Text>{event.label}</Text>
					</View>
					<View style={{ flex: 2 }}>
						<Text>{event.type}</Text>
					</View>
					<View style={{ flex: 4 }}>
						<Text>{event.target}</Text>
					</View>
					<View style={{ flex: 1 }}>
						<Button title={'🗑️'} />
					</View>
				</View>
			))}

			<View
				style={{
					flexDirection: 'row',
					alignItems: 'stretch',
					justifyContent: 'flex-start',
				}}
			>
				<View style={{ flex: 4 }}>
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
				</View>
				<View style={{ flex: 2 }}>
					<Text>+</Text>
				</View>
				<View style={{ flex: 4 }}>
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
				</View>
				<View style={{ flex: 1 }}>
					<Button title={'Add'} />
				</View>
			</View>
		</>
	);
};
