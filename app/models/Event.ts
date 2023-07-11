// This TS version of the Task model shows how to create Realm objects using
// TypeScript syntax, using `@realm/babel-plugin`
// (https://github.com/realm/realm-js/blob/main/packages/babel-plugin/).
//
// If you are not using TypeScript and `@realm/babel-plugin`, you instead need
// to defining a schema on the class - see `Task.js` in the Realm example app
// for an example of this.

import {Realm} from '@realm/react';

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

export enum TYPES {
	Positive = '+',
	Negative = '-',
  Noticeable = 'n'
}

export enum RecuringPositiveEvents {
	Music = 'Music',
	Chess = 'Chess',
	Gym = 'Gym',
	Learn = 'Learn',
}

export const RecuringNegativeEvents = {
	Sleep: {
		text: 'Sleep',
		target: 8.5 * 60, // in minutes
	},
	Zip: {
		text: '☔︎',
		target: 1, // in times per day
	},
};