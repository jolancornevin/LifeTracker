import * as React from 'react';

import { Text, Button, TouchableOpacity, View, StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { ddmmyyyy, stringToDate } from '../../utils';

export const NextScreenButton = ({
	nextScreenName,
	params = {},
}: {
	nextScreenName: string;
	params?;
}) => {
    const navigation = useNavigation();

	return (
		<View style={styles.nextWrapper}>
            <TouchableOpacity
                style={styles.nextButton}
                onPress={() => navigation.navigate(nextScreenName, params)}
            >
                <Text style={{ fontSize: 18 }}>
                    {">>>"}
                </Text>
            </TouchableOpacity>
        </View>
	);
};

const styles = StyleSheet.create({
	nextWrapper: {
		height: 60,

		alignItems: 'center',
		justifyContent: 'space-evenly',
	},
	nextButton: {
		paddingTop: 5,
		paddingBottom: 5,
		paddingLeft: 20,
		paddingRight: 20,

		borderWidth: 1,
		borderRadius: 10,
		borderColor: 'grey',

		backgroundColor: 'white'
	}
});