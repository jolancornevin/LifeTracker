import { Realm } from '@realm/react';

// export class Virtues extends Realm.Object<Virtues> {
// 	_id!: Realm.BSON.ObjectId;
// 	date!: Date;
// 	values!: Realm.Dictionary;

// 	static generate(date: Date, values: Realm.Dictionary) {
// 		return {
// 			_id: new Realm.BSON.ObjectId(),
// 			date,
// 			values,
// 		};
// 	}

// 	static schema = {
// 		name: 'Virtues',
// 		properties: {
// 			_id: 'objectId',
// 			date: 'date',
// 			values: '{}',
// 		},
// 		primaryKey: '_id',
// 	};
// }

// To use a class as a Realm object type in Typescript with the `@realm/babel-plugin` plugin,
// simply define the properties on the class with the correct type and the plugin will convert
// it to a Realm schema automatically.
export class Virtues extends Realm.Object<Virtues> {
	_id!: Realm.BSON.ObjectId;
	date!: Date;
	values!: Realm.Dictionary<string>;

	static primaryKey = '_id';

	// constructor(realm: Realm, description: string, userId?: string) {
	//   super(realm, {description, userId: userId || '_SYNC_DISABLED_'});
	// }
}
