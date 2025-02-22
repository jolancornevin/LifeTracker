import Realm from "realm";

export const HabitsList = [
	{label: 'teeths', icon: '🦷'},
	{label: 'shower', icon: '🚿'},
	{label: 'hand', icon: '✋'},
	{label: 'smoke', icon: '🚬'},
	{label: 'clean', icon: '🧹'},
	{label: 'hair', icon: '✂️'},
]

// To use a class as a Realm object type in Typescript with the `@realm/babel-plugin` plugin,
// simply define the properties on the class with the correct type and the plugin will convert
// it to a Realm schema automatically.
export class Habits extends Realm.Object<Habits> {
	_id!: Realm.BSON.ObjectId;
	date!: number; // TODO index that once it's supported

	label!: string;
	value!: number;

	static primaryKey = '_id';
}
