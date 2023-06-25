import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import { ScrollView, View, Text, Button, TextInput } from 'react-native';
import { EventUI } from './components/events/events';
import { VirtuesUI } from './components/virtues/virtues';
import { SettingsUI } from './components/settings/settings';
import { HomeUI } from './components/home/home';

export type RootStackParamList = {
	HomeUI: {},
	VirtuesUI: {
		// useRealm: () => Realm;
	};
	EventUI: {};
	Settings: {};
};

const Stack = createNativeStackNavigator();

export const AppNonSync = () => {
	return (
		<>
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen
						name="HomeUI"
						component={HomeUI}
					/>
					<Stack.Screen
						name="VirtuesUI"
						component={VirtuesUI}
					/>
					<Stack.Screen
						name="EventUI"
						component={EventUI}
					/>
					<Stack.Screen
						name="Settings"
						component={SettingsUI}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</>
	);
};

/*
const Stack = createBottomTabNavigator<RootStackParamList>();

export const AppNonSync = () => {
	return (
		<>
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen
						name="VirtuesUI"
						component={VirtuesUI}
						options={{ title: 'Day' }}
					/>
					<Stack.Screen
						name="EventUI"
						component={EventUI}
						options={{ title: 'Events' }}
					/>
					<Stack.Screen
						name="Settings"
						component={SettingsUI}
						options={{ title: 'Settings' }}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</>
	);
}; */
