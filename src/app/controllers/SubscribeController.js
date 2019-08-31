import * as yup from 'yup';
import { isBefore, parseISO, isAfter } from 'date-fns';
import Subscribe from '../models/Subscribe';
import Meetup from '../models/Meetup';

class SubscribeController {
	async store(req, res) {
		const {
			userId: user_id,
			body: { meetup_id },
		} = req;

		const schema = yup.object().shape({
			meetup_id: yup.number().required(),
			user_id: yup.number().required(),
		});

		if (!(await schema.isValid({ meetup_id, user_id }))) {
			return res
				.status(400)
				.json({ error: 'Validation fail. Check information' });
		}

		const meetup = await Meetup.findByPk(meetup_id);

		if (!meetup) {
			return res.status(404).json({ error: 'Meetup does not exist' });
		}

		if (meetup.user_id === user_id) {
			return res.status(400).json({
				error:
					"You organize this meetup. You don't need then subscribe",
			});
		}

		if (isAfter(parseISO(meetup.date), new Date())) {
			return res.status(400).json({ error: 'This meetup already past' });
		}

		const subscribe = await Subscribe.findOne({
			where: [{ meetup_id }, { user_id }],
		});

		if (subscribe) {
			return res
				.status(400)
				.json({ error: 'You already subscriber at this meetup' });
		}

		// O usuário não pode se inscrever em dois meetups que acontecem no mesmo horário.

		// Enviar email ao organizador

		const subscriber = await Subscribe.create({ meetup_id, user_id });

		return res.json(subscriber);
	}
}

export default new SubscribeController();
