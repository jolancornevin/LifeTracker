import React, { Dispatch, SetStateAction, useEffect } from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { View } from 'react-native';
import { EventUI } from '../components/events/events_ui';
import { SettingsUI } from '../components/settings/settings_ui';
import { ReportUI } from '../components/report/report_ui';
import { Header, HeaderContext, HeaderTitle } from '../components/utils/header';
import { newDate } from '../utils';

export type RootStackParamList = {
	EventUI: undefined;
	SettingsUI: undefined;
	ReportUI: undefined;
};

declare global {
	namespace ReactNavigation {
	  interface RootParamList extends RootStackParamList {}
	}
  }

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNonSync() {
	const [date, setDate] = React.useState(newDate());

	return (
		<HeaderContext.Provider value={{ _date: date.toJSON(), setDate: setDate }}>
			<Stack.Navigator
				initialRouteName="EventUI"
				screenOptions={{
					header: () => <HeaderTitle />,
					headerBackVisible: false,
				}}
			>
				<Stack.Screen name="EventUI" component={EventUI} />
				<Stack.Screen name="ReportUI" component={ReportUI} />

				<Stack.Screen name="SettingsUI" component={SettingsUI} />
			</Stack.Navigator>
		</HeaderContext.Provider>
	);
}
