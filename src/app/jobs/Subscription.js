import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../services/Mail';

class Subscription {
	get key() {
		return 'Subscription';
	}

	async handle({ data }) {
		const { meetup, user } = data;

		await Mail.send({
			from: 'Grupo meetup <noreplay@meetup.com>',
			to: `${meetup.User.name} <${meetup.User.email}>`,
			subject: `Nova inscrição em "${meetup.title}"`,
			template: 'subscription',
			context: {
				meetup: meetup.title,
				user: user.name,
				date: format(
					parseISO(meetup.date),
					`dd 'de' MMMM', às' H:mm'h'`,
					{
						locale: pt,
					}
				),
			},
		});
	}
}

export default new Subscription();
