import React, { useEffect } from 'react';

import { Button, View } from 'react-native';

import { EventTimer, createEventTimer, deleteEventTimer, getEventTimers } from '../../models/event_timer';
import { computeTimeDiffToNow } from '../../utils';
import colors from '../../styles/colors';

// time diff is in seconds
export const displayTimerElapsedTime = (timeDiff: number) => {
	const seconds = timeDiff % 60,
		minutes = Math.floor(timeDiff / 60) % 60,
		hours = Math.floor(timeDiff / (60 * 60));

	return (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
};

export const Timer = ({
	realm,
	label,

	onStop,
}: {
	realm: Realm;
	label: string;
	onStop: (value: number) => void;
}) => {
	const [existingTimer, setExistingTimer] = React.useState<EventTimer | null>(getEventTimers(realm, label));
	const [timeDiff, setTimeDiff] = React.useState<number>(0);

	useEffect(() => {
		if (existingTimer) {
			const interval = setInterval(() => {
				setTimeDiff(computeTimeDiffToNow(existingTimer.date));
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
					color={colors.green}
					onPress={() => {
						setExistingTimer(createEventTimer(realm, label));
					}}
				/>
			</View>
		);
	}

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
					title={displayTimerElapsedTime(timeDiff)}
					color={colors.blue}
					onPress={() => {
						onStop(timeDiff);
						setExistingTimer(null);
						deleteEventTimer(realm, existingTimer);
						setTimeDiff(0);
					}}
				/>
			</View>
			<Button
				title={'x'}
				color={colors.red}
				onPress={() => {
					setExistingTimer(null);
					deleteEventTimer(realm, existingTimer);
					setTimeDiff(0);
				}}
			/>
		</View>
	);
};
