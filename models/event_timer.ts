import Realm from "realm";

import { newLocalDateTime } from '../utils';

// To use a class as a Realm object type in Typescript with the `@realm/babel-plugin` plugin,
// simply define the properties on the class with the correct type and the plugin will convert
// it to a Realm schema automatically.
export class EventTimer extends Realm.Object<EventTimer> {
	_id: Realm.BSON.ObjectId = new Realm.BSON.ObjectId();
	label!: string;

	date!: number;

	static primaryKey = '_id';
}

export const getEventTimers = (realm: Realm, label: string): EventTimer | null => {
	const res = realm.objects<EventTimer>('EventTimer').filtered(`label = '${label}'`);
	return res.length == 1 ? res[0] : null;
};

export const createEventTimer = (realm: Realm, label: string): EventTimer => {
	return realm.write(() => {
		return realm.create<EventTimer>('EventTimer', {
			_id: new Realm.BSON.ObjectId(),

			label: label,

			date: newLocalDateTime().getTime(),
		});
	});
};

export const deleteEventTimer = (realm: Realm, timer: EventTimer) => {
	realm.write(() => {
		realm.delete(timer);
	});
};
