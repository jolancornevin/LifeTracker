import * as React from 'react';

import { View } from 'react-native';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { CalendarModal } from '../utils/calendar_modal';
import { VirtuesForDate } from './virtues_for_date';

import { ddmmyyyy } from '../../utils';
import { Header } from '../utils/header';
import { RealmContext } from '../../models';
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

	const [calendarVisible, setCalendarVisible] = React.useState(false);

	const [date, setDate] = React.useState(ddmmyyyy(new Date()));

	return (
		<FooterNavigation>
			<View>
				<Header
					date={date}
					setDate={setDate}
					setCalendarVisible={setCalendarVisible}
				/>

				<VirtuesForDate realm={realm} date={date} />
			</View>

			<NextScreenButton nextScreenName={'EventUI'} />

			<CalendarModal
				date={date}
				calendarVisible={calendarVisible}
				setDate={setDate}
				setCalendarVisible={setCalendarVisible}
			/>
		</FooterNavigation>
	);
};
