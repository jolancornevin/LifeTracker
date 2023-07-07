import React from 'react';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { StyleSheet, View, Button, TextInput, Text } from 'react-native';
import { RealmContext } from '../../models/main';
import { FooterNavigation } from '../utils/footer_navigation';
import { ExportToEmail } from '../../models/exporter';

const { useRealm } = RealmContext;

type RootStackParamList = {
	SettingsUI: {
		// useRealm: () => Realm;
	};
};

export const SettingsUI = ({
	route,
}: BottomTabScreenProps<RootStackParamList, 'SettingsUI'>) => {
	const realm = useRealm();

	const [realmText, setRealmText] = React.useState<string>('');
	const [done, setDone] = React.useState(false);

	return (
		<FooterNavigation>
			<View style={styles.content}>
				<Button
					title={'Export'}
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

				<View
					style={{
						paddingTop: 50,
					}}
				>
					<TextInput
						editable
						multiline
						onChangeText={setRealmText}
						value={realmText}
						style={{
							height: 200,
							width: '100%',

							borderWidth: 1,
							borderRadius: 5,

							paddingTop: 100,
						}}
					/>
				</View>

				<View
					style={{
						paddingTop: 5,
					}}
				>
					<Button
						title={'Import'}
						onPress={() => {
							const values = JSON.parse(realmText);

							realm.write(() => {
								realm.deleteAll();

								values['Event'].forEach((obj) => {
									const vv = obj;
									vv['_id'] = new Realm.BSON.ObjectId(
										obj['_id'],
									);

									realm.create('Event', obj);
								});

								values['DayRating'].forEach((obj) => {
									const vv = obj;
									vv['_id'] = new Realm.BSON.ObjectId(
										obj['_id'],
									);

									realm.create('DayRating', obj);
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

const styles = StyleSheet.create({
	content: {
		flex: 1,
		paddingTop: 20,
		paddingHorizontal: 20,
	},
});
