import { createRealmContext } from '@realm/react';

import { DayRating } from './DayRating';
import { Event } from './event';
import { Virtues } from './Virtues';

export const RealmContext = createRealmContext({
	schema: [Event, Virtues, DayRating],
	deleteRealmIfMigrationNeeded: true,
});