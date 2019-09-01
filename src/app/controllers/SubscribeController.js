import * as yup from 'yup';
import { isBefore } from 'date-fns';
import Subscribe from '../models/Subscribe';
import Meetup from '../models/Meetup';
import Queue from '../../services/Queue';
import Subscription from '../jobs/Subscription';
import User from '../models/User';

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

		const user = await User.findByPk(user_id);
		const meetup = await Meetup.findByPk(meetup_id, { include: [User] });

		if (user.id === meetup.User.id) {
			return res.status(400).json({
				error: "You don't need to subscriber in your own meetup",
			});
		}

		if (isBefore(meetup.date, new Date())) {
			return res
				.status(400)
				.json({ error: "You can't to subscriber in past meetups" });
		}

		const checkSubscriberExists = await Subscribe.findOne({
			where: [{ meetup_id }, { user_id }],
		});

		if (checkSubscriberExists) {
			return res
				.status(400)
				.json({ error: 'You already subscriber in this meetup' });
		}

		// [*] O usuário não pode se inscrever em dois meetups que acontecem no mesmo horário.

		const subscriber = await Subscribe.create({ meetup_id, user_id });

		await Queue.add(Subscription.key, {
			meetup,
			user,
		});

		return res.json(subscriber);
	}
}

export default new SubscribeController();
