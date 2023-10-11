import * as MailComposer from 'expo-mail-composer';

export const ExportToEmail = (realm, onSuccess, onReject) => {
	var body = JSON.stringify({
		EventSettings: realm.objects('EventSettings').filter((event) => event),
		Event: realm.objects('Event').filter((event) => event.value),
		DayRating: realm.objects('DayRating').filter((event) => event.value),
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
