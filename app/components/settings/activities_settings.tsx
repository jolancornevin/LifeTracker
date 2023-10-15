import React, { useEffect } from 'react';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { StyleSheet, View, Button, TextInput, Text } from 'react-native';
import { RealmContext } from '../../models/main';
import { FooterNavigation } from '../utils/footer_navigation';
import { ExportToEmail } from '../../models/exporter';
import { ImportExport } from './import_export';
import {
	ACTIVITY_TYPES,
	createEventsSettings,
	deleteEventsSetting,
	getEventsSettings,
} from '../../models/event_settings';

const { useRealm } = RealmContext;

export const ActivitiesSettings = () => {
	const realm = useRealm();

	const recuringActivitySettings = getEventsSettings(realm);

	const [activityName, setActivityName] = React.useState<string>('');
	const [activityType, setactivityType] = React.useState<ACTIVITY_TYPES>(ACTIVITY_TYPES.Positive);
	const [activityTarget, setActivityTarget] = React.useState<string>('');
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

		createEventsSettings(realm, activityName, activityType, Number(activityTarget));
		setErrorText('');
		setActivityName('');
		setActivityTarget('');
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
					<Button title={activityType} color={'grey'} onPress={onNextActivityType} />
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
				<View style={{ flex: 2 }}>
					<Button title={'Add'} onPress={onAdd} />
				</View>
			</View>
			<Text style={{ color: 'red' }}>{errorText}</Text>
			<Text style={{ color: 'green' }}>{successText}</Text>
		</>
	);
};
