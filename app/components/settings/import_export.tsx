import React from 'react';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { StyleSheet, View, Button, TextInput, Text } from 'react-native';
import { RealmContext } from '../../models/main';
import { FooterNavigation } from '../utils/footer_navigation';
import { ExportToEmail } from '../../models/exporter';
import { getEventsSettings } from '../../models/event_settings';

const { useRealm } = RealmContext;

export const ImportExport = () => {
	const realm = useRealm();

	const [realmText, setRealmText] = React.useState<string>('');
	const [done, setDone] = React.useState(false);

	return (
		<>
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
									if (obj["_id"]) {
										obj["_id"] = new Realm.BSON.ObjectId(obj["_id"]);
									}
									realm.create(type, obj);
								});
							});

							setDone(true);
						});
					}}
				/>
			</View>

			<Text>{done && 'done'}</Text>
		</>
	);
};
