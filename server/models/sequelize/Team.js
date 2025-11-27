import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database.js';

class Team extends Model {}

Team.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Please add a team name'
      }
    }
  },
  // Foreign keys for relationships
  hubId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'hubs',
      key: 'id'
    },
    validate: {
      notNull: {
        msg: 'Please assign a hub to this team'
      }
    }
  },
  teamLeadId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    validate: {
      notNull: {
        msg: 'Please assign a team lead'
      }
    }
  }
}, {
  sequelize,
  modelName: 'team',
  timestamps: true,
  indexes: [
    // Index for foreign keys to improve join performance
    { fields: ['hub_id'] },
    { fields: ['team_lead_id'] },
    // Composite indexes for common query patterns
    { fields: ['hub_id', 'team_lead_id'] }
  ],
  hooks: {
    // Before a team is deleted, update all drivers to have no team
    beforeDestroy: async (team) => {
      const Driver = await import('./Driver.js');
      await Driver.default.update(
        { team_id: null },
        { where: { team_id: team.id } }
      );
    }
  }
});

export default Team;