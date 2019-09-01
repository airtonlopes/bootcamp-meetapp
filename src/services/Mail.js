import nodemailer from 'nodemailer';
import { resolve } from 'path';
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';
import mailconfig from '../config/mail';

class Mail {
	constructor() {
		const { host, port, secure, auth } = mailconfig;
		this.transporter = nodemailer.createTransport({
			host,
			port,
			secure,
			auth: auth.user ? auth : null,
		});

		this.templates();
	}

	templates() {
		const viewPath = resolve(__dirname, '..', 'app', 'views', 'mail');
		this.transporter.use(
			'compile',
			nodemailerhbs({
				viewEngine: exphbs.create({
					layoutsDir: resolve(viewPath, 'layouts'),
					partialsDir: resolve(viewPath, 'partials'),
					defaultLayout: 'default',
					extname: '.hbs',
				}),
				viewPath,
				extName: '.hbs',
			})
		);
	}

	send(message) {
		return this.transporter.sendMail({
			...mailconfig,
			...message,
		});
	}
}

export default new Mail();
