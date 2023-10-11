import { createRealmContext } from '@realm/react';

import { DayRating } from './DayRating';
import { Event } from './event';
import { EventSettings } from './event_settings';
import { EventTimer } from './event_timer';

export const RealmContext = createRealmContext({
	schema: [Event, DayRating, EventSettings, EventTimer],
	deleteRealmIfMigrationNeeded: true,
});