// This TS version of the Task model shows how to create Realm objects using
// TypeScript syntax, using `@realm/babel-plugin`
// (https://github.com/realm/realm-js/blob/main/packages/babel-plugin/).
//
// If you are not using TypeScript and `@realm/babel-plugin`, you instead need
// to defining a schema on the class - see `Task.js` in the Realm example app
// for an example of this.

import {Realm} from '@realm/react';

export enum TYPES {
	Positive = '+',
	Negative = '-',
  Noticeable = 'n'
}

// To use a class as a Realm object type in Typescript with the `@realm/babel-plugin` plugin,
// simply define the properties on the class with the correct type and the plugin will convert
// it to a Realm schema automatically.
export class EventSettings extends Realm.Object<EventSettings> {
  _id: Realm.BSON.ObjectId = new Realm.BSON.ObjectId();

  label!: string;
  type!: string; // TYPES

  target: number;

  static primaryKey = '_id';
}

// TODO make sure the order is fixed
export const getEventsSettings = (
	realm: Realm,
): EventSettings[] => {
	let settings = realm
		.objects<EventSettings>('EventSettings').map((setting) => setting);

	/* if (settings.length === 0) {
		// Fixtures in order to have something working in the begginning.
		// TODO make a Hello screen where we have to configure those at first start.
		// This will be an issue if the user wants to remove all his events.
		[
			{label: "Music", type: TYPES.Positive, target: 0},
			{label: "Chess", type: TYPES.Positive, target: 0},
			{label: "Gym", type: TYPES.Positive, target: 0},

			{label: "Learn", type: TYPES.Positive, target: 0},
			{label: "Read", type: TYPES.Positive, target: 0},
			{label: "Code", type: TYPES.Positive, target: 0},

			{label: "Social Interactions", type: TYPES.Positive, target: 0},

			{label: "Sleep", type: TYPES.Negative, target: 8.5 * 60},
			{label: "Zip", type: TYPES.Negative, target: 1},
		].map(({label, type, target}) => {
			createEventsSettings(realm, label, type, target);
		})

		settings = realm
			.objects<EventSettings>('EventSettings').map((setting) => setting);
	} */

	return settings;
}

export const createEventsSettings = (
	realm: Realm,
	label: string,
	type: TYPES,
	target?: number,
) => {
	realm.write(() => {
		realm.create('EventSettings', {
			_id: new Realm.BSON.ObjectId(),

			label: label,
			type: type,

			target: target
		});
	});
}