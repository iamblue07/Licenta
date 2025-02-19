import Sequelize from 'sequelize'

import CreateAnuntBazarEntity from './AnuntBazar.mjs'
import CreateAprecieriEntity from './Aprecieri.mjs'
import CreateCarteEntity from './Carte.mjs'
import CreateCarteCititaEntity from './CarteCitita.mjs'
import CreateChatBazarEntity from './ChatBazar.mjs'
import CreateForumEntity from './Forum.mjs'
import CreateGenLiterarEntity from './GenLiterar.mjs'
import CreateMesajForumEntity from './MesajForum.mjs'
import CreateMesajChatEntity from './MesajChat.mjs'
import CreateOfertaCarteEntity from './OfertaCarte.mjs'
import CreatePreferinteEntity from './Preferinte.mjs'
import CreateRaportEntity from './Raport.mjs'
import CreateRecomandareAIEntity from './RecomandareAI.mjs'
import CreateRestrictiiEntity from './Restrictii.mjs'
import CreateUtilizatorEntity from './Utilizator.mjs'

const sequelize = new Sequelize('LicentaDB', 'root', 'admin', {
    host: "localhost",
    port: 3307,
    dialect: "mysql"
});

(async () => {
    try {
      await sequelize.authenticate();
      console.log('Connected to MySQL!');
    } catch (error) {
      console.error('Unable to connect:', error);
    }
})();

const AnuntBazar = CreateAnuntBazarEntity(sequelize, Sequelize)
const Aprecieri = CreateAprecieriEntity(sequelize, Sequelize)
const Carte = CreateCarteEntity(sequelize, Sequelize)
const CarteCitita = CreateCarteCititaEntity(sequelize, Sequelize)
const ChatBazar = CreateChatBazarEntity(sequelize, Sequelize)
const Forum = CreateForumEntity(sequelize, Sequelize)
const GenLiterar = CreateGenLiterarEntity(sequelize, Sequelize)
const MesajForum = CreateMesajForumEntity(sequelize, Sequelize)
const MesajChat = CreateMesajChatEntity(sequelize, Sequelize)
const OfertaCarte = CreateOfertaCarteEntity(sequelize, Sequelize)
const Preferinte = CreatePreferinteEntity(sequelize, Sequelize)
const Raport = CreateRaportEntity(sequelize, Sequelize)
const RecomandareAI = CreateRecomandareAIEntity(sequelize, Sequelize)
const Restrictii = CreateRestrictiiEntity(sequelize, Sequelize)
const Utilizator = CreateUtilizatorEntity(sequelize, Sequelize)

Forum.hasMany(MesajForum, { foreignKey: 'idForum' })
MesajForum.belongsTo(Forum, { foreignKey: 'id' })

ChatBazar.hasMany(MesajChat, { foreignKey: 'idChat' })
MesajChat.belongsTo(ChatBazar, { foreignKey: 'id' })

AnuntBazar.hasMany(ChatBazar, { foreignKey: 'idAnunt' })
ChatBazar.belongsTo(AnuntBazar, { foreignKey: 'id' })

Utilizator.hasMany(AnuntBazar, { foreignKey: 'idUtilizator' })
AnuntBazar.belongsTo(Utilizator, { foreignKey: 'id' })

Utilizator.hasMany(Preferinte, { foreignKey: 'idUtilizator' })
Preferinte.belongsTo(Utilizator, { foreignKey: 'id' })

Utilizator.hasMany(Restrictii, { foreignKey: 'idUtilizator' })
Restrictii.belongsTo(Utilizator, { foreignKey: 'id' })

Utilizator.hasMany(Raport, { foreignKey: 'idAdministrator' })
Raport.belongsTo(Utilizator, { foreignKey: 'id' })

Utilizator.hasOne(RecomandareAI, { foreignKey: 'idUtilizator' })
RecomandareAI.belongsTo(Utilizator, { foreignKey: 'id' })

Utilizator.hasMany(Aprecieri, { foreignKey: 'idUtilizator' })
Aprecieri.belongsTo(Utilizator, { foreignKey: 'id' })

Utilizator.hasMany(CarteCitita, { foreignKey: 'idUtilizator' })
CarteCitita.belongsTo(Utilizator, { foreignKey: 'id' })

Utilizator.hasMany(Forum, { foreignKey: 'idUtilizator' })
Forum.belongsTo(Utilizator, { foreignKey: 'id' })

Utilizator.hasMany(MesajForum, { foreignKey: 'idUtilizator' })
MesajForum.belongsTo(Utilizator, { foreignKey: 'id' })

Utilizator.hasMany(MesajChat, { foreignKey: 'idUtilizator' })
MesajChat.belongsTo(Utilizator, { foreignKey: 'id' })

Carte.hasMany(CarteCitita, { foreignKey: 'idCarte' })
CarteCitita.hasOne(Carte, { foreignKey: 'id' })

Carte.hasMany(Aprecieri, { foreignKey: 'idCarte' })
Aprecieri.hasOne(Carte, { foreignKey: 'id' })

Carte.hasMany(OfertaCarte, { foreignKey: 'idCarte' })
OfertaCarte.hasOne(Carte, { foreignKey: 'id' })

Carte.hasMany(GenLiterar, { foreignKey: 'idCarte' })
GenLiterar.hasOne(Carte, { foreignKey: 'id' })

Carte.hasMany(RecomandareAI, { foreignKey: 'idCarte' })
RecomandareAI.hasOne(Carte, { foreignKey: 'id' })

try {
    await sequelize.sync({
      alter: false,
      force: false
    });
    console.log('Database synchronized successfully.');
} catch (err) {
    console.error('Failed to synchronize database:', err);
}

export default {
  sequelize,
  AnuntBazar,
  Aprecieri,
  Carte,
  CarteCitita,
  ChatBazar,
  Forum,
  GenLiterar,
  MesajForum,
  MesajChat,
  OfertaCarte,
  Preferinte,
  Raport,
  RecomandareAI,
  Restrictii,
  Utilizator
}