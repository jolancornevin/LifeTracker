import { createRealmContext } from '@realm/react';
import { Task } from './Task';
import { Virtues } from './Virtues';

export const TaskRealmContext = createRealmContext({
	schema: [Task, Virtues],
	deleteRealmIfMigrationNeeded: true,
});
