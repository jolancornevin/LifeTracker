import React from 'react';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { StyleSheet, View, Text } from 'react-native';

import { DayRatingUI } from './day_rating';

import { RealmContext } from '../../models/main';
import { FooterNavigation } from '../utils/footer_navigation';
import { NavigationButtons } from '../utils/next_screen_button';
import colors from '../../styles/colors';
import { HeaderContext, HeaderTitle } from '../utils/header';

const { useRealm, useQuery } = RealmContext;

type RootStackParamList = {
	HomeUI: {
		// date: Date;
	};
};

export const HomeUI = ({ route }: BottomTabScreenProps<RootStackParamList, 'HomeUI'>) => {
	const realm = useRealm();

	// const date = new Date(route.params.date);
	const { _date } = React.useContext(HeaderContext);
	const date = React.useMemo(() => new Date(_date), [_date]);

	return (
		<FooterNavigation>
			<>
				<View style={styles.wrapper}>
					<View style={styles.content}>
						<Text style={{ fontSize: 26, paddingBottom: 50 }}>How was your day? 😃</Text>

						<DayRatingUI realm={realm} date={date} />
					</View>
				</View>

				<NavigationButtons nextScreenName={'EventUI'} />
			</>
		</FooterNavigation>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		alignItems: 'center',
	},
	content: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	nextWrapper: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 60,
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
		borderColor: colors.grey,

		backgroundColor: colors.white,
	},
});
