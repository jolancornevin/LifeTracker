import * as React from 'react';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import colors from '../../styles/colors';

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
			<View style={{ flex: 1 }}>{props.children}</View>
			<View
				style={{
					width: '100%',
					height: 60,

					// backgroundColor: '#efefef',

					alignItems: 'center',
					justifyContent: 'space-evenly',
					flexDirection: 'row',

					borderWidth: 1,
					borderTopColor: colors.grey,
				}}
			>
				<TouchableOpacity onPress={() => navigation.navigate('EventUI')}>
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
		color: colors.black,
	},
});
