import * as React from 'react';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import colors from '../../styles/colors';


export const NavigationButtons = ({ nextScreenName, params }: { nextScreenName?: string; params?: {date: string, monthly?: boolean} }) => {
	const navigation = useNavigation();

	return (
		<View style={styles.nextWrapper}>
			{navigation.canGoBack() && (
				<TouchableOpacity
					style={styles.nextButton}
					onPress={() => {
						navigation.goBack();
						// navigation.getState().params.date = params.date;
					}}
				>
					<Text style={{
							fontSize: 28,
							fontWeight: "700",
							color: colors.grey,
							position: 'relative',
							bottom: 6,
						}}
					>
						{'⇦'}
					</Text>
				</TouchableOpacity>
			)}
			{nextScreenName && (
				<TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate(nextScreenName)}>
					<Text style={{
							fontSize: 28,
							fontWeight: "700",
							color: colors.grey,
							position: 'relative',
							bottom: 6,
						}}
					>
						{'⇨'}
					</Text>
				</TouchableOpacity>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	nextWrapper: {
		height: 40,
		marginBottom: 10,

		flexDirection: 'row',

		alignItems: 'center',
		justifyContent: 'space-evenly',
	},
	nextButton: {
		//paddingBottom: 5,

		paddingLeft: 20,
		paddingRight: 20,

		borderWidth: 1,
		borderRadius: 10,
		borderColor: colors.grey,

		backgroundColor: colors.white,
	},
});
