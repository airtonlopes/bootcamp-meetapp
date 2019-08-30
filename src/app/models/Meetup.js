import Sequelize, { Model } from 'sequelize';

class Meetup extends Model {
	static init(sequelize) {
		super.init(
			{
				banner_id: Sequelize.INTEGER,
				user_id: Sequelize.INTEGER,
				title: Sequelize.STRING,
				description: Sequelize.TEXT,
				date: Sequelize.DATE,
			},
			{ sequelize }
		);
		return this;
	}

	static associate(models) {
		this.belongsTo(models.File, { foreignKey: 'banner_id', as: 'banner' });
		this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
	}
}

export default Meetup;
