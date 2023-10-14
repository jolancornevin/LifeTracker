import React from 'react';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { ScrollView, View } from 'react-native';
import { RealmContext } from '../../models/main';
import { FooterNavigation } from '../utils/footer_navigation';
import { ImportExport } from './import_export';
import { ActivitiesSettings } from './activities_settings';

const { useRealm } = RealmContext;

type RootStackParamList = {
	SettingsUI: {
		// useRealm: () => Realm;
	};
};

export const SettingsUI = ({ route }: BottomTabScreenProps<RootStackParamList, 'SettingsUI'>) => {
	return (
		<FooterNavigation>
			<ScrollView
				style={{
					flex: 1,
					paddingTop: 20,
					paddingHorizontal: 20,
				}}
			>
				<ActivitiesSettings />

				<ImportExport />

				<View style={{ paddingBottom: 32 }}>{/* space for scroll view */}</View>
			</ScrollView>
		</FooterNavigation>
	);
};
