import * as React from 'react';

import { View, Text, FlatList } from 'react-native';

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
			<Text style={{ fontSize: 22 }}>{days}</Text>
			<Text style={{ fontSize: 16 }}> days - </Text>
			<Text style={{ fontSize: 22 }}>{hours < 10 ? '0' + hours : hours}</Text>
			<Text style={{ fontSize: 16 }}>h</Text>
			<Text style={{ fontSize: 22 }}>{minutes < 10 ? '0' + minutes : minutes}</Text>
			<Text style={{ fontSize: 16 }}>m</Text>
			<Text style={{ fontSize: 22 }}>{seconds < 10 ? '0' + seconds : seconds}</Text>
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
			{/* <Text style={{ fontSize: 16, fontWeight: '600' }}>You're doing it !</Text> */}
			<View style={{ flex: 1, width: '100%', alignItems: 'center', }}>
				<Text style={{ fontSize: 22, fontWeight: '600' }}>{displayElapsedTime(timeDiff)}</Text>
			</View>
			<View style={{  paddingTop: 8, alignItems: 'center', }}>
				{/* <Text style={{ fontSize: 18, fontWeight: '600' }}>{'Thoughs:'}</Text> */}

				{[
					{ key: 'Be Grateful'},
					{ key: 'Calm and Kind - Self Love'},
					{ key: 'Be Content'},
					{ key: ''},
				].map((item, index) => (
					<Text key={index} style={{ fontWeight: '600'  }}>
						{item.key}
					</Text>
				))}
			</View>
		</>
	);
};
