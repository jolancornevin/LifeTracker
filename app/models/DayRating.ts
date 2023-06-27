import { Realm } from '@realm/react';

export class DayRating extends Realm.Object<DayRating> {
	_id!: Realm.BSON.ObjectId;
	date!: number; // TODO index that once it's supported
	value!: string;

	static primaryKey = '_id';
}
