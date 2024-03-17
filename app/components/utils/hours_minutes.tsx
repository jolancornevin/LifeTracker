import React from 'react';

import { Text } from 'react-native';

export const HoursMinutes = ({ minutes }: { minutes: number }) => {
	let hours = Math.floor(minutes / 60),
		minutesLeft = minutes % 60;

	return (
		<Text>
			{hours > 0 && `${hours}h`}
			{minutesLeft > 0 && `${minutesLeft}`}
		</Text>
	);
};
