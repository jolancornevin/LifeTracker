import * as React from 'react';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import colors from '../../styles/colors';
import { CustomButton } from '@/utils';

export const FooterNavigation = ({ children }: { children: React.JSX.Element }) => {
	const navigation = useNavigation();

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: '#efefef',
				paddingTop: 50,
			}}
		>
			<View style={{ flex: 1 }}>{children}</View>
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
				<CustomButton onPress={() => navigation.navigate('EventUI')}>
					<Text>Home</Text>
				</CustomButton>
				<CustomButton onPress={() => navigation.navigate('SettingsUI')}>
					<Text>Settings</Text>
				</CustomButton>
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
