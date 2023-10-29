import React, { useEffect } from 'react';

import { View, Button } from 'react-native';

import { EventTimer, createEventTimer, deleteEventTimer, getEventTimers } from '../../models/event_timer';
import { newDate } from '../../utils';


export const Timer = ({
	realm,
	label,

	onStop,
}: {
	realm: Realm;
	label: string;
	onStop: (value: number) => void;
}) => {
	const [existingTimer, onChangeExistingTimer] = React.useState<EventTimer | null>(getEventTimers(realm, label));
	const [timeDiff, onTimeDiffChange] = React.useState<number>(0);

	useEffect(() => {
		if (existingTimer) {
			const interval = setInterval(() => {
				onTimeDiffChange(Math.floor((newDate().getTime() - existingTimer.date) / 1000));
			}, 1000);

			return () => clearInterval(interval);
		}

		return () => {};
	}, [existingTimer]);

	if (!existingTimer) {
		return (
			<View
				style={{
					width: '100%',
				}}
			>
				<Button
					title={'Start 🕒'}
					color={'green'}
					onPress={() => {
						onChangeExistingTimer(createEventTimer(realm, label));
					}}
				/>
			</View>
		);
	}

	const minutes = Math.floor(timeDiff / 60),
		seconds = timeDiff % 60,
		timeDiffDisplay = (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);

	return (
		<View
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				paddingTop: 8,
			}}
		>
			<View style={{ paddingRight: 8 }}>
				<Button
					title={timeDiffDisplay}
					color={'blue'}
					onPress={() => {
						onStop(timeDiff);
						onChangeExistingTimer(null);
						deleteEventTimer(realm, existingTimer);
						onTimeDiffChange(0);
					}}
				/>
			</View>
			<Button
				title={'x'}
				color={'red'}
				onPress={() => {
					onChangeExistingTimer(null);
					deleteEventTimer(realm, existingTimer);
					onTimeDiffChange(0);
				}}
			/>
		</View>
	);
};
