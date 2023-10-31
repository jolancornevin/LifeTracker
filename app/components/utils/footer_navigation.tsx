import * as React from 'react';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';

export const FooterNavigation = (props) => {
	const navigation = useNavigation();

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: '#efefef',
				paddingTop: 20,
			}}
		>
			<View style={{ flex: 1, paddingHorizontal: 20 }}>{props.children}</View>
			<View
				style={{
					width: '100%',
					height: 60,

					// backgroundColor: '#efefef',

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
				<TouchableOpacity onPress={() => navigation.navigate('Settings')}>
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
