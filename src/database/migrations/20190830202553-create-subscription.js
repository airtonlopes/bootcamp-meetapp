'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
	  return queryInterface.createTable('subscription', {
		  id: {
			  type: Sequelize.INTEGER,
			  primaryKey: true,
			  autoIncrement: true,
			  allowNull: false,
		  },
		  meetup_id: {
			  type: Sequelize.INTEGER,
			  references: {
				  model: 'meetups', key: 'id'
			  },
			  onUpdate: 'CASCADE',
			  onDelete: 'SET NULL',
			  allowNull: false
		  },
		  user_id: {
			type: Sequelize.INTEGER,
			references: {
				model: 'users', key: 'id'
			},
			onUpdate: 'CASCADE',
			onDelete: 'SET NULL',
			allowNull: false
		 },
		 created_at: {
			 type: Sequelize.DATE,
			 allowNull: false
		 },
		 updated_at: Sequelize.DATE
     });
  },

  down: (queryInterface) => {
	  return queryInterface.dropTable('subscription');
  }
};
