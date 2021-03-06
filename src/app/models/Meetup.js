import Sequelize, { Model } from 'sequelize';

class Meetup extends Model {
	static init(sequelize) {
		super.init(
			{
				title: Sequelize.STRING,
				description: Sequelize.TEXT,
				date: Sequelize.DATE,
			},
			{ sequelize }
		);
		return this;
	}

	static associate(models) {
		this.hasMany(models.Subscribe, { foreignKey: 'meetup_id' });
		this.belongsTo(models.File, { foreignKey: 'banner_id' });
		this.belongsTo(models.User, { foreignKey: 'user_id' });
	}
}

export default Meetup;
