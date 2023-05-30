import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import { TaskManager } from './components/Tasks/TaskManager';
import { VirtuesUI } from './components/Virtues/Virtues';

export type RootStackParamList = {
	VirtuesUI: {
		// useRealm: () => Realm;
	};
	Home: {};
};

const Stack = createBottomTabNavigator<RootStackParamList>();

export const AppNonSync = () => {
	return (
		<>
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen name="VirtuesUI" component={VirtuesUI} />
					<Stack.Screen
						name="Home"
						component={TaskManager}
						options={{ title: 'Welcome' }}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</>
	);
};
