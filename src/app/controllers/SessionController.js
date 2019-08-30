import * as yup from 'yup';
import jwt from 'jsonwebtoken';
import authconfig from '../../config/auth';
import User from '../models/User';

class SessionController {
	async store(req, res) {
		const schema = yup.object().shape({
			email: yup
				.string()
				.required()
				.email(),
			password: yup.string().required(),
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'validation fails' });
		}

		const { email, password } = req.body;
		const user = await User.findOne({ where: { email } });
		if (!user) {
			return res.status(401).json({ error: 'user not found' });
		}

		if (!(await user.passwordVerify(password))) {
			return res.status(401).json({ error: 'password does not match' });
		}

		const { id, name } = user;

		return res.json({
			token: jwt.sign({ id, name, email }, authconfig.secret, {
				expiresIn: authconfig.expiresIn,
			}),
		});
	}
}
export default new SessionController();
