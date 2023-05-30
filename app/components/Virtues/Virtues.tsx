import * as React from 'react';

import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { TaskRealmContext } from '../../models';
import { Virtues } from '../../models/Virtues';

enum Status {
	NotSet,
	OK,
	KO,
}

const tableHead = [
	'',
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

type RootStackParamList = {
	VirtuesUI: {
		// useRealm: () => Realm;
	};
};

type Props = BottomTabScreenProps<RootStackParamList, 'VirtuesUI'>;

const { useRealm, useQuery } = TaskRealmContext;

export const VirtuesUI = ({ route }: Props) => {
	const realm = useRealm();
	const virtues = useQuery(Virtues);

	console.log({ virtues });

	const changeStatus = (
		prevStatus: Status,
		rowIndex: number,
		cellIndex: number,
	) => {
		// if (prevStatus === Status.NotSet) {
		// 	setTableData((oldData) => {
		// 		oldData[rowIndex][cellIndex] = Status.OK;
		// 		return [...oldData];
		// 	});
		// } else if (prevStatus === Status.OK) {
		// 	setTableData((oldData) => {
		// 		oldData[rowIndex][cellIndex] = Status.KO;
		// 		return [...oldData];
		// 	});
		// } else if (prevStatus === Status.KO) {
		// 	setTableData((oldData) => {
		// 		oldData[rowIndex][cellIndex] = Status.NotSet;
		// 		return [...oldData];
		// 	});
		// }
	};

	const btnOkKO = (
		currentStatus: Status,
		rowIndex: number,
		cellIndex: number,
	) => {
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
			<TouchableOpacity
				onPress={() => changeStatus(currentStatus, rowIndex, cellIndex)}
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
		);
	};

	return (
		<View style={styles.container}>
			<ScrollView horizontal={true}></ScrollView>
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
