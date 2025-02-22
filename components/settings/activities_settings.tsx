import React, { useEffect } from 'react';


import { Button, Text, TextInput, View } from 'react-native';
import {
	ACTIVITY_TYPES,
	createEventsSettings,
	deleteEventsSetting,
	getEventsSettings,
} from '../../models/event_settings';
import { RealmContext } from '../../models/main';
import colors from '../../styles/colors';

const { useRealm } = RealmContext;

export const ActivitiesSettings = () => {
	const realm = useRealm();

	const recuringActivitySettings = getEventsSettings(realm);

	const [activityName, setActivityName] = React.useState<string>('');
	const [activityType, setactivityType] = React.useState<ACTIVITY_TYPES>(ACTIVITY_TYPES.Positive);
	const [activityTarget, setActivityTarget] = React.useState<string>('');
	const [order, setOrder] = React.useState<string>('');
	const [errorText, setErrorText] = React.useState<string>('');
	const [successText, setSuccessText] = React.useState<string>('');

	useEffect(() => {
		if (successText !== '') {
			let timer = setTimeout(() => {
				setSuccessText('');
			}, 2000);

			return () => {
				clearTimeout(timer);
			};
		}
	}, [successText]);

	function onAdd() {
		if (activityName === '') {
			setErrorText('The name of the activity is required');
			return;
		}
		if (activityTarget === '') {
			setErrorText('The target of the activity is required');
			return;
		}
		if (order === '') {
			setErrorText('The order of the activity is required');
			return;
		}

		createEventsSettings(realm, activityName, activityType, Number(order), Number(activityTarget));
		setErrorText('');
		setActivityName('');
		setActivityTarget('');
		setOrder('');
		setSuccessText('done');
	}

	function onNextActivityType() {
		if (activityType === ACTIVITY_TYPES.Positive) {
			setactivityType(ACTIVITY_TYPES.Negative);
		}

		if (activityType === ACTIVITY_TYPES.Negative) {
			setactivityType(ACTIVITY_TYPES.Positive);
		}
	}

	return (
		<>
			<Text
				style={{
					fontSize: 16,
					fontWeight: '600',

					marginLeft: 'auto',
					marginRight: 'auto',
				}}
			>
				Current activitys
			</Text>

			{recuringActivitySettings.map((activity) => (
				<View
					key={activity.label}
					style={{
						flexDirection: 'row',
						alignItems: 'stretch',
						justifyContent: 'flex-start',
					}}
				>
					<View style={{ flex: 4 }}>
						<Text>{activity.label}</Text>
					</View>
					<View style={{ flex: 2 }}>
						<Text>{activity.type}</Text>
					</View>
					<View style={{ flex: 3 }}>
						<Text>{activity.target}</Text>
					</View>
					<View style={{ flex: 3 }}>
						<Text>{activity.order}</Text>
					</View>
					<View style={{ flex: 2 }}>
						<Button
							title={'🗑️'}
							color={'transparent'}
							onPress={() => {
								deleteEventsSetting(realm, activity);
								setSuccessText('done');
							}}
						/>
					</View>
				</View>
			))}

			<View
				style={{
					flexDirection: 'row',
					paddingTop: 24,
				}}
			>
				<View style={{ flex: 4 }}>
					<Text>Label</Text>
				</View>
				<View style={{ flex: 2 }}>
					<Text>Type</Text>
				</View>
				<View style={{ flex: 3 }}>
					<Text>Target</Text>
				</View>
				<View style={{ flex: 3 }}>
					<Text>Order</Text>
				</View>
				<View style={{ flex: 2 }}></View>
			</View>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'stretch',
					justifyContent: 'flex-start',
					paddingTop: 8,
				}}
			>
				<View style={{ flex: 4 }}>
					{/* label */}
					<TextInput
						style={{
							borderBottomWidth: 1,

							marginRight: 8,
						}}
						editable
						multiline
						onChangeText={setActivityName}
						value={activityName}
					/>
				</View>
				<View style={{ flex: 2 }}>
					{/* type */}
					<Button title={activityType} color={colors.grey} onPress={onNextActivityType} />
				</View>
				<View style={{ flex: 3 }}>
					{/* target */}
					<TextInput
						style={{
							borderBottomWidth: 1,

							marginLeft: 8,
							marginRight: 8,
						}}
						editable
						onChangeText={setActivityTarget}
						value={activityTarget}
						keyboardType={'numeric'}
					/>
				</View>
				<View style={{ flex: 3 }}>
					{/* order */}
					<TextInput
						style={{
							borderBottomWidth: 1,

							marginLeft: 8,
							marginRight: 8,
						}}
						editable
						onChangeText={setOrder}
						value={order}
						keyboardType={'numeric'}
					/>
				</View>
				<View style={{ flex: 2 }}>
					<Button title={'Add'} onPress={onAdd} />
				</View>
			</View>
			<Text style={{ color: colors.red }}>{errorText}</Text>
			<Text style={{ color: colors.green }}>{successText}</Text>
		</>
	);
};
