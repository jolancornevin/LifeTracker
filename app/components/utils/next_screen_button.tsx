import * as React from 'react';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';


export const NextScreenButton = ({ nextScreenName, params = {} }: { nextScreenName: string; params? }) => {
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
					<Text
						style={{
							fontSize: 28,
							fontWeight: 700,
							color: 'grey',
							position: 'relative',
							bottom: 6,
						}}
					>
						{'⇦'}
					</Text>
				</TouchableOpacity>
			)}
			{nextScreenName && (
				<TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate(nextScreenName, params)}>
					<Text
						style={{
							fontSize: 28,
							fontWeight: 700,
							color: 'grey',
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
		borderColor: 'grey',

		backgroundColor: 'white',
	},
});
