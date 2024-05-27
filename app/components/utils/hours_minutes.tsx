import React from 'react';

import { Text } from 'react-native';

export const HoursMinutes = ({ minutes }: { minutes: number }) => {
	let hours = Math.floor(minutes / 60),
		minutesLeft = minutes % 60;

	return (
		<Text>
			{hours || minutesLeft? `${hours || 0}h${String(minutesLeft|| 0).padStart(2, '0')}`: '-'}
		</Text>
	);
};
