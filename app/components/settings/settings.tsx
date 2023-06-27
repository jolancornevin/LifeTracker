import React from 'react';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { StyleSheet, View, Button } from 'react-native';
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
