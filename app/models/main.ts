import { createRealmContext } from '@realm/react';

import { DayRating } from './DayRating';
import { Event } from './event';

export const RealmContext = createRealmContext({
	schema: [Event, DayRating],
	deleteRealmIfMigrationNeeded: true,
});