import * as React from 'react';

import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';

import { useNavigation } from '@react-navigation/native';

export const FooterNavigation = (props) => {
	const navigation = useNavigation();

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: '#efefef',
				paddingTop: 20,
				paddingHorizontal: 20,
			}}
		>
			{props.children}

			<View
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					bottom: 0,
					height: 60,
					alignItems: 'center',
					justifyContent: 'space-evenly',
					flexDirection: 'row',

					borderWidth: 1,
					borderTopColor: 'grey',
				}}
			>
				<TouchableOpacity onPress={() => navigation.navigate('HomeUI')}>
					<Text>Home</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => navigation.navigate('Settings')}
				>
					<Text>Settings</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	btn: {
		backgroundColor: 'transparent',
		color: 'black',
	},
});
