import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

import { ScrollView, View, Text, Button, TextInput } from 'react-native';
import { EventUI } from './components/events/events';
import { SettingsUI } from './components/settings/settings';
import { HomeUI } from './components/day_rating/home';
import { ReportUI } from './components/report/report';
import { Header } from './components/utils/header';
import { newDate } from './utils';

export type RootStackParamList = {
	HomeUI: {};
	EventUI: {};
	Settings: {};
	ReportUI: {};
};

const Stack = createNativeStackNavigator();

const HeaderTitle = ({
	date,
	setDate,
}: {
	date: Date;
	setDate: React.Dispatch<React.SetStateAction<Date>>;
}) => {
	const navigation = useNavigation();

	const _setDate = (newDate: Date) => {
		setDate(newDate);
		navigation.setParams({
			date: newDate.toJSON(),
		});
	};

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
						name="HomeUI"
						component={HomeUI}
						options={({ navigation, route }) => ({
							headerTitle: (props) => (
								<HeaderTitle date={date} setDate={setDate} />
							),
							headerBackVisible: false,
						})}
						initialParams={{ date: date.toJSON(), }}
					/>
					<Stack.Screen
						name="EventUI"
						component={EventUI}
						options={({ navigation, route }) => ({
							headerTitle: (props) => (
								<HeaderTitle date={date} setDate={setDate} />
							),
							headerBackVisible: false,
						})}
						initialParams={{ date: date.toJSON(), }}
					/>
					<Stack.Screen
						name="Settings"
						component={SettingsUI}
						options={({ navigation, route }) => ({
							headerTitle: (props) => (
								<HeaderTitle date={date} setDate={setDate} />
							),
							headerBackVisible: false,
						})}
						initialParams={{ date: date.toJSON(), }}
					/>
					<Stack.Screen
						name="ReportUI"
						component={ReportUI}
						options={({ navigation, route }) => ({
							headerTitle: (props) => (
								<HeaderTitle date={date} setDate={setDate} />
							),
							headerBackVisible: false,
						})}
						initialParams={{ date }}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</>
	);
};
