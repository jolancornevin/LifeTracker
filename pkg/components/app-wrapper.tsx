import * as React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Realm, createRealmContext } from '@realm/react';

import VirtuesUI from '../../app/components/Virtues/Virtues';
import Virtues from '../database/virtues';
import Home from './home';

export type RootStackParamList = {
	VirtuesUI: {
		useRealm: () => Realm;
		useQuery: <T>(
			type: string | ((new (...args: any) => T) & Realm.ObjectClass<any>),
		) => Realm.Results<T & Realm.Object<unknown, never>>;
	};
	Home: {};
};

const Stack = createBottomTabNavigator<RootStackParamList>();

const myRealmConfig = { schema: [Virtues] };

const { RealmProvider, useRealm, useQuery } = createRealmContext(myRealmConfig);

const AppWrapper = () => {
	return (
		<>
			<RealmProvider>
				<NavigationContainer>
					<Stack.Navigator>
						<Stack.Screen
							name="VirtuesUI"
							component={VirtuesUI}
							initialParams={{ useRealm, useQuery }}
						/>
						<Stack.Screen
							name="Home"
							component={Home}
							options={{ title: 'Welcome' }}
							initialParams={{ useRealm, useQuery }}
						/>
					</Stack.Navigator>
				</NavigationContainer>
			</RealmProvider>
		</>
	);
};
export default AppWrapper;
