// This TS version of the Task model shows how to create Realm objects using
// TypeScript syntax, using `@realm/babel-plugin`
// (https://github.com/realm/realm-js/blob/main/packages/babel-plugin/).
//
// If you are not using TypeScript and `@realm/babel-plugin`, you instead need
// to defining a schema on the class - see `Task.js` in the Realm example app
// for an example of this.

import { Realm } from '@realm/react';
import { ACTIVITY_TYPES } from './event_settings';
import { newDate } from '../utils';

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
	let timer;
	realm.write(() => {
		timer = realm.create<EventTimer>('EventTimer', {
			_id: new Realm.BSON.ObjectId(),

			label: label,

			date: newDate().getTime(),
		});
	});

	return timer;
};

export const deleteEventTimer = (realm: Realm, timer: EventTimer) => {
	realm.write(() => {
		realm.delete(timer);
	});
};
