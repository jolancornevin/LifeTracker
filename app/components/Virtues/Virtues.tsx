import * as React from 'react';

import { View, ScrollView } from 'react-native';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { CalendarModal } from '../utils/calendar_modal';
import { VirtuesForDate } from './virtues_for_date';

import { ddmmyyyy, newDate } from '../../utils';
import { Header } from '../utils/header';
import { RealmContext } from '../../models/main';
import { FooterNavigation } from '../utils/footer_navigation';
import { NextScreenButton } from '../utils/next_screen_button';

const { useRealm } = RealmContext;

type RootStackParamList = {
	VirtuesUI: {
		// useRealm: () => Realm;
	};
};

export const VirtuesUI = ({
	route,
}: BottomTabScreenProps<RootStackParamList, 'VirtuesUI'>) => {
	const realm = useRealm();

	const [date, setDate] = React.useState(newDate());

	return (
		<FooterNavigation>
			<View style={{flex: 1}}>
				<Header
					date={date}
					setDate={setDate}
				/>

				<ScrollView>
					<VirtuesForDate realm={realm} date={date} />
				</ScrollView>
			</View>

			<NextScreenButton nextScreenName={'EventUI'} />
		</FooterNavigation>
	);
};
