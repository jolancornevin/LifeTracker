import * as React from 'react';

import { View, Text } from 'react-native';

import { computeTimeDiffToNow, newDate } from '../../utils';
import { useEffect } from 'react';

// time diff is in seconds
export const displayElapsedTime = (timeDiff: number) => {
	const seconds = timeDiff % 60,
		minutes = Math.floor(timeDiff / 60) % 60,
		hours = Math.floor(timeDiff / (60 * 60)) % 24,
		days = Math.floor(timeDiff / (60 * 60 * 24));

	return (
		<>
			<Text>🎉 </Text>
			<Text style={{fontSize: 22}}>{days}</Text>
			<Text style={{fontSize: 18}}>d - </Text>
			<Text style={{fontSize: 22}}>{hours < 10 ? '0' + hours : hours}</Text>
			<Text style={{fontSize: 18}}>h</Text>
			<Text style={{fontSize: 22}}>{minutes < 10 ? '0' + minutes : minutes}</Text>
			<Text style={{fontSize: 18}}>m</Text>
			<Text style={{fontSize: 22}}>{seconds < 10 ? '0' + seconds : seconds}</Text>
			<Text> 🎉</Text>
		</>
	);
};

export const Counter = ({}: {}) => {
	const start = newDate(2025, 1, 18);

	const [timeDiff, setTimeDiff] = React.useState<number>(0);

	useEffect(() => {
		setTimeDiff(computeTimeDiffToNow(start.getTime()));
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			setTimeDiff(computeTimeDiffToNow(start.getTime()));
		}, 1000);

		return () => clearInterval(interval);
	}, [setTimeDiff]);

	return (
		<>
			<Text
				style={{
					fontSize: 16,
					fontWeight: '600',
				}}
			>
				You're doing it !
			</Text>
			<View style={{ flexDirection: 'row' }}>
				<Text
					style={{
						fontSize: 22,
						fontWeight: '600',
					}}
				>
					{displayElapsedTime(timeDiff)}
				</Text>
			</View>
		</>
	);
};
