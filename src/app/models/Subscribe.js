import { Model } from 'sequelize';

class Subscribe extends Model {
	static init(sequelize) {
		super.init(
			{
				// meetup_id: Sequelize.INTEGER,
				// user_id: Sequelize.INTEGER,
			},
			{ sequelize }
		);
		return this;
	}

	static associate(models) {
		this.belongsTo(models.Meetup, { foreignKey: 'meetup_id' });
		this.belongsTo(models.User, { foreignKey: 'user_id' });
	}
}
export default Subscribe;
