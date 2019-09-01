import * as yup from 'yup';
import { Op } from 'sequelize';
import {
	isBefore,
	startOfHour,
	parseISO,
	subHours,
	isPast,
	format,
	startOfDay,
	endOfDay,
} from 'date-fns';
import Meetup from '../models/Meetup';
import User from '../models/User';

class MeetupController {
	/**
	 *
	 */
	async index(req, res) {
		const {
			query: { date = null, page = 1 },
		} = req;

		const criteria = {
			include: [User],
			limit: 10,
			offset: 10 * page - 10,
		};

		if (date) {
			const sDate = parseISO(date);
			criteria.where = {
				date: {
					[Op.between]: [startOfDay(sDate), endOfDay(sDate)],
				},
			};
		}

		const meetups = await Meetup.findAll(criteria);
		return res.json(meetups);
	}

	/**
	 *
	 */
	async store(req, res) {
		const data = req.body;
		data.user_id = req.userId;

		const schema = yup.object().shape({
			banner_id: yup.number().required(),
			user_id: yup.number().required(),
			title: yup.string().required(),
			description: yup.string().required(),
			date: yup.date().required(),
		});

		if (!(await schema.isValid(data))) {
			return res.status(500).json({ error: 'Validation fail' });
		}

		const meetupHour = startOfHour(parseISO(data.date));

		if (isBefore(meetupHour, new Date())) {
			return res
				.status(500)
				.json({ error: 'Past dates are not permited' });
		}

		const meetup = await Meetup.create(data);

		return res.json(meetup);
	}

	/**
	 *
	 */
	async update(req, res) {
		const {
			userId: user_id,
			params: { id },
		} = req;

		const schema = yup.object().shape({
			id: yup.number().required(),
			user_id: yup.number().required(),
		});

		if (!(await schema.isValid({ id, user_id }))) {
			return res.status(500).json({ error: 'validation fails' });
		}

		const meetup = await Meetup.findOne({
			where: [{ id }, { user_id }],
		});

		if (!meetup) {
			return res
				.status(404)
				.json({ error: "You don't have meetup with this id" });
		}

		if (isPast(meetup.date, new Date())) {
			return res
				.status(401)
				.json({ error: 'You cannot change past meetup' });
		}

		return res.json(meetup);
	}

	/**
	 *
	 */
	async delete(req, res) {
		const {
			userId: user_id,
			params: { id },
		} = req;

		const schema = yup.object().shape({
			id: yup.number().required(),
			user_id: yup.number().required(),
		});

		if (!(await schema.isValid({ id, user_id }))) {
			return res.json({ error: 'Validation fails' });
		}

		const meetup = await Meetup.findOne({
			where: [{ id, user_id }],
		});

		if (!meetup) {
			return res
				.status(404)
				.json({ error: "You don't have a meetup with this id" });
		}

		if (isBefore(meetup.date, new Date())) {
			return res.status(500).json({
				error:
					'You cannot cancel this meetup because he already passed',
			});
		}

		const meetupHour = subHours(meetup.date, 2);

		if (isBefore(meetupHour, new Date())) {
			return res.status(500).json({
				error:
					'You cannot cancel this meetup because he start in less at 2 hours',
			});
		}

		if (!(await meetup.destroy())) {
			return res
				.status(500)
				.json({ error: 'They are not possible to process operation' });
		}

		return res.json({ message: `Meetup ${id} deleted succefull` });
	}
}
export default new MeetupController();
