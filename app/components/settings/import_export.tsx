import React from 'react';

import { View, Button, TextInput, Text } from 'react-native';
import { RealmContext } from '../../models/main';
import { ExportToEmail } from '../../models/exporter';
import { newDate } from '../../utils';

const { useRealm } = RealmContext;

export const ImportExport = () => {
	const realm = useRealm();

	const [realmText, setRealmText] = React.useState<string>('');
	const [done, setDone] = React.useState(false);

	return (
		<>
			<View style={{ paddingTop: 32 }}>
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
									if (obj['_id']) {
										obj['_id'] = new Realm.BSON.ObjectId(obj['_id']);
									}

									// reset all hours to UTC 0.
									// this code is not really going to be needed for the future,
									// it's just that the old dates weren't fixed to hours 0
									if (obj?.date) {
										const correctedDate = new Date(obj.date);
										if (correctedDate.getUTCHours() != 0) {
											obj.date = newDate(
												correctedDate.getUTCFullYear(),
												correctedDate.getUTCMonth(),
												correctedDate.getUTCDate() + 1,
											);

											obj.date = obj.date.getTime();
										}

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
