import * as React from 'react';

import { View } from 'react-native';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { TaskRealmContext } from '../../models';
import { ddmmyyyy } from '../../utils';

import { Header } from './header';
import { CalendarModal } from './calendar_modal';
import { VirtuesForDate } from './virtues_for_date';
import { styles } from './styles';

const { useRealm, useQuery } = TaskRealmContext;

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
		<View style={styles.container}>
			<Header
				date={date}
				setDate={setDate}
				setCalendarVisible={setCalendarVisible}
			/>

			<VirtuesForDate realm={realm} date={date} />

			<CalendarModal
				date={date}
				calendarVisible={calendarVisible}
				setDate={setDate}
				setCalendarVisible={setCalendarVisible}
			/>
		</View>
	);
};
