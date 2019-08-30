import jwt from 'jsonwebtoken';
import authconfig from '../../config/auth';
import { promisify } from 'util';
export default async (req, res, next) => {
	const authtoken = req.headers.authorization;
	if (!authtoken) {
		return res.status(401).json({ error: 'token no provided' });
	}

	const [, token] = authtoken.split(' ');

	const auth = await promisify(jwt.verify)(token, authconfig.secret);

	req.userId = auth.id;

	return next();
};
