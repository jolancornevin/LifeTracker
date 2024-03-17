import React, { useEffect } from 'react';

import { Button, View } from 'react-native';

import { EventTimer, createEventTimer, deleteEventTimer, getEventTimers } from '../../models/event_timer';
import { newDateTime } from '../../utils';

// returns the diff of time between now and the timer, in seconds
export const computeTimeDiff = (existingTimer: EventTimer) => {
	const currentTime = newDateTime().getTime();

	return Math.floor((currentTime - existingTimer.date) / 1000);
};

// time diff is in seconds
export const displayTimerElapsedTime = (timeDiff: number) => {
	const seconds = timeDiff % 60,
		minutes = Math.floor(timeDiff / 60) % 60,
		hours = Math.floor(timeDiff / (60 * 60)),
		timeDiffDisplay =
			(hours < 10 ? '0' + hours : hours) +
			':' +
			(minutes < 10 ? '0' + minutes : minutes) +
			':' +
			(seconds < 10 ? '0' + seconds : seconds);

	return timeDiffDisplay;
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
				setTimeDiff(computeTimeDiff(existingTimer));
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
					color={'blue'}
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
				color={'red'}
				onPress={() => {
					setExistingTimer(null);
					deleteEventTimer(realm, existingTimer);
					setTimeDiff(0);
				}}
			/>
		</View>
	);
};
