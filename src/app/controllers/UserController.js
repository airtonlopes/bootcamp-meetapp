import User from '../models/User';
import * as yup from 'yup';

class UserController {
	index(req, res) {
		return res.json({ message: 'Hello Meetapp' });
	}

	async store(req, res) {
		try {
			const schema = yup.object().shape({
				name: yup.string().required(),
				email: yup
					.string()
					.required()
					.email(),
				password: yup
					.string()
					.min(6)
					.required(),
				password_confirm: yup
					.string()
					.when('password', (password, field) =>
						password
							? field.required().oneOf([yup.ref('password')])
							: field
					),
			});

			if (!(await schema.isValid(req.body))) {
				return res.status(400).json({ error: 'validation fails' });
			}

			if (await User.findOne({ where: { email: req.body.email } })) {
				return res.status(500).json({ error: 'user already exists' });
			}

			const { name, email, provider } = await User.create(req.body);

			return res.json({
				name,
				email,
				provider,
			});
		} catch (err) {
			return res.status(500).json(err);
		}
	}

	async update(req, res) {
		try {
			const schema = yup.object().shape({
				name: yup.string(),
				email: yup.string().email(),
				password: yup.string().min(6),
				password_old: yup
					.string()
					.when('password', (password, field) =>
						password ? field.required() : field
					),
				password_confirm: yup
					.string()
					.when('password', (password, field) =>
						password
							? field.required().oneOf([yup.ref('password')])
							: field
					),
			});

			if (!(await schema.isValid(req.body))) {
				return res.status(400).json({ error: 'validation fails' });
			}

			const user = await User.findByPk(req.userId);

			if (!user) {
				return res.status(400).json({ error: 'user not found' });
			}

			if (req.body.password) {
				if (!(await user.passwordVerify(req.body.password_old))) {
					return res
						.status(500)
						.json({ error: 'password does not match' });
				}
			}

			if (req.body.email && req.body.email !== user.email) {
				if (await User.findOne({ where: { email: req.body.email } })) {
					return res
						.status(500)
						.json({ error: 'user already exists' });
				}
			}

			const { id, name, email, provider } = await user.update(req.body);
			return res.json({
				id,
				name,
				email,
				provider,
			});
		} catch (err) {
			return res.status(500).json(err);
		}
	}
}

export default new UserController();
