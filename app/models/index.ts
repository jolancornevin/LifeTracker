import { createRealmContext } from '@realm/react';
import * as MailComposer from 'expo-mail-composer';

import { DayRating } from './DayRating';
import { Event } from './Event';
import { Virtues } from './Virtues';

export const RealmContext = createRealmContext({
	schema: [Event, Virtues, DayRating],
	deleteRealmIfMigrationNeeded: true,
});

export const ExportToEmail = (realm, onSuccess, onReject) => {
	var body = JSON.stringify({
		"Event": realm.objects('Event'),
		"Virtues": realm.objects('Virtues'),
		"DayRating": realm.objects('DayRating'),
	});

	var options = {
		subject: 'LifeTracker Save',
		recipients: ['cornevin.jolan@gmail.com'],
		body: body,
	};

	return new Promise((resolve, reject) => {
		MailComposer.composeAsync(options)
			.then((result) => {
				onSuccess(result);
				resolve(result);
			})
			.catch((error) => {
				onReject(error);
				reject(error);
			});
	});
};
