import Realm from "realm";
import { ACTIVITY_TYPES } from './event_settings';

// To use a class as a Realm object type in Typescript with the `@realm/babel-plugin` plugin,
// simply define the properties on the class with the correct type and the plugin will convert
// it to a Realm schema automatically.
export class Event extends Realm.Object<Event> {
	_id: Realm.BSON.ObjectId = new Realm.BSON.ObjectId();
	label!: string;
	value!: string;
	date!: number;
	type!: string;

	static primaryKey = '_id';
}

export const NOTICEABLE_LABEL = 'Noticable';

export const upsertEvent = (
	realm: Realm,
	date: Date,
	event: Event | undefined,
	label: string,
	value: string,
	type: string,
): Event => {
	// upsert the value if the event exits
	if (event?._id) {
		realm.write(() => {
			event.value = value;
		});

		const updatedEvent = realm.objects<Event>('Event').filtered(`_id = oid(${event._id})`);

		return updatedEvent[0];
	}

	// create the event for the value
	const newID = new Realm.BSON.ObjectId();
	realm.write(() => {
		realm.create('Event', {
			_id: newID,
			date: date.getTime(),
			label: label,
			value: value,
			type: type,
		});
	});

	const createdEvent = realm.objects<Event>('Event').filtered(`_id = oid(${newID})`);

	return createdEvent[0];
};

export const getEventsForDate = (realm: Realm, date: Date): Record<string, Event> => {
	let events = realm.objects<Event>('Event').filtered(`date = ${date.getTime()}`);

	let result: Record<string, Event> = {};
	events.forEach((event: Event) => {
		result[event.label] = event;
	});

	return result;
};

export const getOrCreateNoticeableEventForDate = (realm: Realm, date: Date): Event => {
	let events = realm.objects<Event>('Event').filtered(`date = ${date.getTime()} and label = '${NOTICEABLE_LABEL}'`);

	if (events.length !== 0) {
		return events[0];
	}

	let event: Event = realm.write(() => {
		return realm.create<Event>('Event', {
			_id: new Realm.BSON.ObjectId(),
			date: date.getTime(),
			label: NOTICEABLE_LABEL,
			value: '',
			type: ACTIVITY_TYPES.Noticeable,
		});
	});

	return event;
};
