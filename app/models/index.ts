import { createRealmContext } from '@realm/react';
import { DayRating } from './DayRating';
import { Task } from './Task';
import { Virtues } from './Virtues';

export const TaskRealmContext = createRealmContext({
	schema: [Task, Virtues, DayRating],
	deleteRealmIfMigrationNeeded: true,
});
