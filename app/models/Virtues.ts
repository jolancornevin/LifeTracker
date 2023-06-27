import { Realm } from '@realm/react';

export class Virtues extends Realm.Object<Virtues> {
	_id!: Realm.BSON.ObjectId;
	date!: number; // TODO index that once it's supported
	values!: Realm.Dictionary<string>;

	static primaryKey = '_id';
}
