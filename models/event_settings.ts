import Realm from "realm";

export enum ACTIVITY_TYPES {
	Positive = '+',
	Negative = '-',
	Noticeable = 'n',
}

// To use a class as a Realm object type in Typescript with the `@realm/babel-plugin` plugin,
// simply define the properties on the class with the correct type and the plugin will convert
// it to a Realm schema automatically.
export class EventSettings extends Realm.Object<EventSettings> {
	_id: Realm.BSON.ObjectId = new Realm.BSON.ObjectId();

	label!: string;
	type!: string; // ACTIVITY_TYPES

	order!: number;

	target: number;

	static primaryKey = '_id';
}

export const getEventsSettings = (realm: Realm): EventSettings[] => {
	return realm.objects<EventSettings>('EventSettings').map((setting) => setting).sort((a, b) => a.order - b.order);
};

export const createEventsSettings = (realm: Realm, label: string, type: ACTIVITY_TYPES, order: number, target?: number) => {
	realm.write(() => {
		realm.create('EventSettings', {
			_id: new Realm.BSON.ObjectId(),

			label: label,
			type: type,

			target: target,
			order: target,
		});
	});
};

export const deleteEventsSetting = (realm: Realm, setting: EventSettings) => {
	realm.write(() => {
		realm.delete(setting);
	});
};
