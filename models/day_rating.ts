import Realm from "realm";

// To use a class as a Realm object type in Typescript with the `@realm/babel-plugin` plugin,
// simply define the properties on the class with the correct type and the plugin will convert
// it to a Realm schema automatically.
export class DayRating extends Realm.Object<DayRating> {
	_id!: Realm.BSON.ObjectId;
	date!: number; // TODO index that once it's supported
	value!: string;

	static primaryKey = '_id';
}
