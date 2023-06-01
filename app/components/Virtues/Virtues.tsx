import * as React from 'react';

import {
	FlatList,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Modal,
} from 'react-native';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';

import { TaskRealmContext } from '../../models';
import { Virtues } from '../../models/Virtues';
import { ddmmyyyy, formatToDate } from '../../utils';

import { virtuesList, virtuesDef } from './virtues_conf';

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

const VirtuesForDate = ({ realm, date }: { realm: Realm; date: string }) => {
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

const Header = ({
	date,
	setCalendarVisible,
}: {
	date: string;
	setCalendarVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	return (
		<View
			style={{
				flexDirection: 'row',
				alignItems: 'center',
			}}
		>
			<TouchableOpacity style={{ flex: 1, alignItems: 'center' }}>
				<Text style={{ color: 'blue', fontWeight: 'bold' }}>
					{'< Prev'}
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={{ flex: 1, alignItems: 'center' }}
				onPress={() => setCalendarVisible(true)}
			>
				<Text
					style={{
						flex: 1,
						alignItems: 'center',
						textDecorationLine: 'underline',
					}}
				>
					{date}
				</Text>
			</TouchableOpacity>

			<TouchableOpacity style={{ flex: 1, alignItems: 'center' }}>
				<Text style={{ color: 'blue', fontWeight: 'bold' }}>
					{'Next >'}
				</Text>
			</TouchableOpacity>
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
	const realm = useRealm();

	const [calendarVisible, setCalendarVisible] = React.useState(false);

	const [date, setDate] = React.useState(ddmmyyyy(new Date()));

	return (
		<View style={styles.container}>
			<Header date={date} setCalendarVisible={setCalendarVisible} />

			<VirtuesForDate realm={realm} date={date} />

			<Modal
				animationType="slide"
				transparent={true}
				visible={calendarVisible}
			>
				<View>
					<Calendar
						onDayPress={(date: DateData) => {
							setDate(
								formatToDate(date.day, date.month, date.year),
							);
							setCalendarVisible(false);
						}}
					/>
				</View>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		paddingTop: 30,
		backgroundColor: '#fff',
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
