import { Realm } from '@realm/react';

export const HabitsList = [
	{label: 'teeths', icon: '🦷'},
	{label: 'shower', icon: '🚿'},
	{label: 'hand', icon: '✋'},
	{label: 'smoke', icon: '🚬'},
	{label: 'clean', icon: '🧹'},
	{label: 'hair', icon: '✂️'},
]

export class Habits extends Realm.Object<Habits> {
	_id!: Realm.BSON.ObjectId;
	date!: number; // TODO index that once it's supported

	label!: string;
	value!: number;

	static primaryKey = '_id';
}
