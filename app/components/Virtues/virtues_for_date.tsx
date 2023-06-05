import * as React from 'react';

import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { TaskRealmContext } from '../../models';
import { Virtues } from '../../models/Virtues';

import { virtuesList, virtuesDef } from './virtues_conf';
import { styles } from './styles';

const { useRealm, useQuery } = TaskRealmContext;

enum Status {
	NotSet = 'NotSet',
	NA = 'N/A',
	OK = 'OK',
	KO = 'KO',
}

const getOrCreateVirtuesForDate = (realm: Realm, date: string): Virtues => {
	let virtues = useQuery(Virtues).filtered(`date = "${date}"`);

	if (virtues.length === 0) {
		realm.write(() => {
			realm.create('Virtues', {
				_id: new Realm.BSON.ObjectId(),
				date: date,
				values: Object.fromEntries(
					virtuesList.map((value) => [value, Status.NotSet]),
				),
			});
		});
	}

	// re-run it outside of the if because react doesn't want hooks to be run in conditions...
	// It's ugly, but it's ok since it's a pretty quick query.
	virtues = useQuery(Virtues).filtered(`date = "${date}"`);
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
		newStatus = Status.NA;
	} else if (prevStatus === Status.NA) {
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

	if (currentStatus === Status.NA) {
		color = 'white';
		text = '-';
	} else if (currentStatus === Status.NotSet) {
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
	date: string;
}) => {
	const virtue = getOrCreateVirtuesForDate(realm, date);

	return (
		<ScrollView>
			<View
				style={{
					...styles.container,
					flexDirection: 'row',
					flexWrap: 'wrap',
					alignItems: 'flex-start',
				}}
			>
				{Object.entries(virtue.values).map(([label, currentStatus]) => {
					return virtueElement(
						realm,
						virtue,
						label,
						currentStatus as Status,
					);
				})}
			</View>
		</ScrollView>
	);
};
