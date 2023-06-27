import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import { AppNonSync } from './AppNonSync';
import { RealmContext } from './models/main';
import colors from './styles/colors';

export const AppWrapperNonSync = () => {
	const { RealmProvider } = RealmContext;

	// If sync is disabled, setup the app without any sync functionality and return early
	return (
		<SafeAreaView style={styles.screen}>
			<RealmProvider>
				<AppNonSync />
			</RealmProvider>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: colors.darkBlue,
	},
});
