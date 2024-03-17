import React, { useEffect } from 'react';

import { Text, TextInput, View } from 'react-native';
import { HoursMinutes } from '../utils/hours_minutes';
import { Timer } from './timer';

export const TextEntry = ({
	realm,

	label,
	value,
	onChange,
	target,
}: {
	realm: Realm;
	label: string;
	value: string;
	onChange: (value: string) => void;
	target?: number;
}) => {
	const [text, setText] = React.useState("");

	useEffect(() => {
		if (text != value) {
			setText(value);
		}
	}, [value]);

	return (
		<View
			style={{
				width: '100%',
				flexDirection: 'row',
				alignItems: 'stretch',
				justifyContent: 'flex-start',
				paddingTop: 8,
			}}
		>
			<View style={{ flex: 1 }}>
				<Text>{label + ':'}</Text>
			</View>
			<View
				style={{ flex: 2, alignItems: 'center', flexDirection: 'row', marginLeft: 'auto', marginRight: 'auto' }}
			>
				<TextInput
					style={{
						width: 54,

						borderBottomWidth: 1,

						paddingLeft: 10,
						marginLeft: 10,
					}}
					onChangeText={setText}
					onSubmitEditing={() => {
						onChange(text);
					}}
					onBlur={() => {
						onChange(text);
					}}
					value={text}
					keyboardType={'numeric'}
				/>
				<Text>{' minutes'}</Text>
				{Number(text) >= 60 ? (
					<>
						<Text>{' ('}</Text>
						<HoursMinutes minutes={Number(text)} />
						<Text>{')'}</Text>
					</>
				) : (
					<></>
				)}
			</View>
			<View style={{ flex: 1, alignItems: 'flex-end' }}>
				<Timer
					realm={realm}
					label={label}
					onStop={(timeElapsed) => {
						const timeElapsedMinutes = Math.floor(timeElapsed / 60);
						const previousValue = Number(text);
						onChange((previousValue + timeElapsedMinutes).toString());
					}}
				/>
			</View>
		</View>
	);
};
