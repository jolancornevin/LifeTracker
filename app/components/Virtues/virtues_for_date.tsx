import * as React from 'react';

import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { RealmContext } from '../../models/main';
import { Virtues } from '../../models/Virtues';

import { virtuesList, virtuesDef } from './virtues_conf';
import { styles } from './styles';

const { useRealm, useQuery } = RealmContext;

enum Status {
	NotSet = 'NotSet',
	NA = 'N/A',
	OK = 'OK',
	KO = 'KO',
}

const getOrCreateVirtuesForDate = (realm: Realm, date: Date): Virtues => {
	let virtues = useQuery(Virtues).filtered(`date = ${date.getTime()}`);

	if (virtues.length === 0) {
		realm.write(() => {
			realm.create('Virtues', {
				_id: new Realm.BSON.ObjectId(),
				date: date.getTime(),
				values: Object.fromEntries(
					virtuesList.map((value) => [value, Status.NotSet]),
				),
			});
		});
	}

	// re-run it outside of the if because react doesn't want hooks to be run in conditions...
	// It's ugly, but it's ok since it's a pretty quick query.
	virtues = useQuery(Virtues).filtered(`date = ${date.getTime()}`);
	return virtues[0];
};

const updateVirtueStatus = (
	realm: Realm,
	virtue: Virtues,
	label: string,
	prevStatus: Status,
) => {
	let newStatus = prevStatus;

	if (prevStatus === Status.NotSet) {
		newStatus = Status.OK;
	} else if (prevStatus === Status.OK) {
		newStatus = Status.KO;
	} else if (prevStatus === Status.KO) {
		newStatus = Status.NotSet;
	}

	realm.write(() => {
		virtue.values.set({ ...virtue.values, [label]: newStatus });
	});
};

const virtueElement = (
	realm: Realm,
	virtue: Virtues,
	label: string,
	currentStatus: Status,
) => {
	let color = '',
		text = '';

	if (currentStatus === Status.NotSet) {
		color = 'white';
		text = virtuesDef[label];
	} else if (currentStatus === Status.OK) {
		color = 'green';
		text = '';
	} else if (currentStatus === Status.KO) {
		color = 'red';
		text = '';
	} else {
		text = 'hu?';
	}

	return (
		<View
			key={label}
			style={{
				width: '50%',
				height: 100,
				alignItems: 'center',
				paddingLeft: 4,
			}}
		>
			<Text style={{ fontWeight: 'bold' }}>{label}</Text>
			<TouchableOpacity
				style={{
					width: '100%',
					height: '100%',
					alignItems: 'center',
				}}
				onPress={() =>
					updateVirtueStatus(realm, virtue, label, currentStatus)
				}
			>
				{text ? (
					<Text>{text}</Text>
				) : (
					<View
						style={{
							width: 58,
							height: 18,
							backgroundColor: color,
							borderRadius: 2,
						}}
					/>
				)}
			</TouchableOpacity>
		</View>
	);
};

export const VirtuesForDate = ({
	realm,
    date,
}: {
    realm: Realm;
	date: Date;
}) => {
	const virtue = getOrCreateVirtuesForDate(realm, date);

	return (
			<View
				style={{
					...styles.container,
					flexDirection: 'row',
					flexWrap: 'wrap',
					alignItems: 'flex-start',
					backgroundColor: 'transparent'
				}}
			>
				{virtuesList.map((label) => {
					return virtueElement(
						realm,
						virtue,
						label,
						virtue.values[label] as Status,
					);
				})}
			</View>
	);
};
