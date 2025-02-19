import { createRealmContext } from '@realm/react';

import { Event } from './event';
import { DayRating } from './day_rating';
import { EventSettings } from './event_settings';
import { EventTimer } from './event_timer';
import { Habits } from './habits';

export const RealmContext = createRealmContext({
	schema: [Event, DayRating, EventSettings, EventTimer, Habits],
	deleteRealmIfMigrationNeeded: true,
});
