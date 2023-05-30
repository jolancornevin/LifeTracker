import * as React from 'react';

import {
	FlatList,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { TaskRealmContext } from '../../models';
import { Virtues } from '../../models/Virtues';
import { yyyymmdd } from '../../utils';

const { useRealm, useQuery } = TaskRealmContext;

enum Status {
	NotSet = 'NotSet',
	OK = 'OK',
	KO = 'KO',
}

// TODO store that in a collection so that we can update it
// Think how merge previously existing data.
const virtuesList = [
	'TEMPERANCE',
	'SILENCE',
	'ORDER',
	'RESOLUTION',
	'FRUGALITY',
	'INDUSTRY',
	'SINCERITY',
	'JUSTICE',
	'MODERATION',
	'CLEANLINESS',
	'TRANQUILLITY',
	'CHASTITY',
	'HUMILITY',
	'GRATITUDE',
];

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

		virtues = useQuery(Virtues).filtered(`date = "${date}"`);
	}
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

const VirtuesForDate = ({ date }: { date: string }) => {
	const realm = useRealm();
	const virtue = getOrCreateVirtuesForDate(realm, date);

	return (
		<View style={styles.container}>
			<ScrollView horizontal={true}>
				<FlatList
					data={Object.keys(virtue.values)}
					renderItem={(props) => {
						let label = props['item'],
							currentStatus = virtue.values[
								props['item']
							] as Status;

						let color = '',
							text = '';

						if (currentStatus === Status.NotSet) {
							color = 'white';
							text = '?';
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
							<View key={props.index}>
								<Text>{label}</Text>
								<TouchableOpacity
									onPress={() =>
										updateVirtueStatus(
											realm,
											virtue,
											label,
											currentStatus,
										)
									}
								>
									<View
										style={{
											width: 58,
											height: 18,
											backgroundColor: color,
											borderRadius: 2,
										}}
									>
										<Text>{text}</Text>
									</View>
								</TouchableOpacity>
							</View>
						);
					}}
				/>
			</ScrollView>
		</View>
	);
};

type RootStackParamList = {
	VirtuesUI: {
		// useRealm: () => Realm;
	};
};

export const VirtuesUI = ({
	route,
}: BottomTabScreenProps<RootStackParamList, 'VirtuesUI'>) => {
	const date = yyyymmdd(new Date());
	return (
		<View style={styles.container}>
			<VirtuesForDate date={date} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		paddingTop: 30,
		backgroundColor: '#fff',
		width: '100%',
	},
	head: { height: 40, backgroundColor: '#808B97' },
	text: { margin: 6 },
	row: {
		flexDirection: 'row',
		backgroundColor: '#fff',
		borderColor: 'black',
		border: '2px',
	},
	btnText: { textAlign: 'center', color: '#fff' },
});
