import React, { useEffect } from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

import { View } from 'react-native';
import { EventUI } from './components/events/events_ui';
import { SettingsUI } from './components/settings/settings_ui';
import { ReportUI } from './components/report/report_ui';
import { Header } from './components/utils/header';
import { newDate } from './utils';

export type RootStackParamList = {
	EventUI: {};
	Settings: {};
	ReportUI: {};
};

const Stack = createNativeStackNavigator();

const HeaderTitle = ({ date, setDate }: { date: Date; setDate: React.Dispatch<React.SetStateAction<Date>> }) => {
	const navigation = useNavigation();

	const _setDate = (newDate: Date) => {
		setDate(newDate);
		navigation.setParams({
			date: newDate.toJSON(),
		});
	};

	useEffect(() => {
		navigation.setParams({
			date: date.toJSON(),
		});
	}, [date]);

	return (
		<View style={{ flex: 1, alignItems: 'center' }}>
			<Header date={date} setDate={_setDate} />
		</View>
	);
};

export const AppNonSync = () => {
	const [date, setDate] = React.useState(newDate());

	return (
		<>
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen
						name="EventUI"
						component={EventUI}
						options={({ navigation, route }) => ({
							headerTitle: (props) => <HeaderTitle date={date} setDate={setDate} />,
							headerBackVisible: false,
						})}
						initialParams={{ date: date.toJSON() }}
					/>
					<Stack.Screen
						name="ReportUI"
						component={ReportUI}
						options={({ navigation, route }) => ({
							headerTitle: (props) => <HeaderTitle date={date} setDate={setDate} />,
							headerBackVisible: false,
						})}
						initialParams={{ date: date.toJSON() }}
					/>

					<Stack.Screen
						name="Settings"
						component={SettingsUI}
						options={({ navigation, route }) => ({
							headerTitle: (props) => <HeaderTitle date={date} setDate={setDate} />,
							headerBackVisible: false,
						})}
						initialParams={{ date: date.toJSON() }}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</>
	);
};
