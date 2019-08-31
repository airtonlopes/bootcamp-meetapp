import Sequelize, { Model } from 'sequelize';

class Subscribe extends Model {
	static init(sequelize) {
		super.init(
			{
				meetup_id: Sequelize.INTEGER,
				user_id: Sequelize.INTEGER,
			},
			{ sequelize }
		);
	}
}
export default Subscribe;
