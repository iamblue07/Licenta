import models from '../models/index.mjs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from "url";
dotenv.config();

const salt = await bcrypt.genSalt(10);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const checkEmailExists = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await models.Utilizator.findOne({ where: { email } });
        if (user) {
            return res.status(200).json({ exists: true });
        }
        return res.status(200).json({ exists: false });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const checkUsernameTaken = async (req, res) => {
    try {
        const { username } = req.body;
        const user = await models.Utilizator.findOne({ where: { username } });
        if (user) {
            return res.status(200).json({ taken: true });
        }
        return res.status(200).json({ taken: false });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const createUtilizator = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await models.Utilizator.create({
            email,
            username,
            parolaHash: passwordHash,
            dataInregistrare: new Date(),
            poateCreaAnunt: true,
            poateCreaForum: true,
            poateTrimiteMesaj: true,
            poateRaporta: true,
            esteAdministrator: false
        });

        await models.Preferinte.create({
            idUtilizator: newUser.id,
            preferintaUnu: "",
            preferintaDoi: "",
            preferintaTrei: "",
            preferintaPatru: "",
            preferintaCinci: ""
        });

        const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.SECRET_KEY, { expiresIn: '1h' });

        return res.status(201).json({ user: newUser, token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const loginUtilizator = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await models.Utilizator.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.parolaHash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        return res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getUtilizatorData = async (req, res) => {
    try {
        const userId = req.user.id; 
        const user = await models.Utilizator.findByPk(userId, {
            attributes: [ 'id', 'username', 'descriere', 'esteAdministrator']
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const updateUtilizatorDescriere = async(req, res) => {
    try {
        const userId = req.user.id;
        const {descriere} = req.body;
        if (!descriere) {
            return res.status(400).json({ error: 'Descrierea nu poate fi nula' });
        }
        const user = await models.Utilizator.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'Utilizatorul nu a fost găsit' });
        }
        user.descriere = descriere;
        await user.save();
        return res.status(200).json({ message: 'Descriere actualizată cu succes' });
    }catch(error) {
        return res.status(500).json({error: 'Internal server error'});
    }
}

const updateUtilizatorParola = async(req, res) => {
    try {
        const userId = req.user.id;
        const {oldPassword, newPassword} = req.body;
        if (!oldPassword) {
            return res.status(400).json({error:"Parola nu poate fi nula"});
        }
        const user = await models.Utilizator.findByPk(userId);
        if (!user){
            return res.status(404).json({error: "Utilizatorul nu a fost gasit!"});
        }
        const passIsValid = await bcrypt.compare(oldPassword, user.parolaHash);
        if(!passIsValid) {
            return res.status(401).json({message: "Parola veche nu este corecta!"});
        }
        const passwordHash = await bcrypt.hash(newPassword, salt);
        user.parolaHash = passwordHash;
        await user.save();
        return res.status(200).json({message: "Parola a fost actualizata cu succes!"});
    }catch(error) {
        return res.status(500).json({error: 'Internal server error'});
    }
}

const uploadImagineProfil = async(req, res) => {
    try {
        if(!req.file) {
            return res.status(400).json({message:"Niciun fisier incarcat!"});
        }
        const userId = req.user.id;
        const caleImagine = `uploads/${req.file.filename}`;
        const user = await models.Utilizator.findByPk(userId);
        if(!user) {
            return res.status(404).json({error:"Utilizatorul nu exista"});
        }

        if (user.caleImagineProfil) {
            const caleVeche = path.join(__dirname, '..', user.caleImagineProfil);
            if (fs.existsSync(caleVeche)) {
                fs.unlinkSync(caleVeche);
            }
        }

        user.caleImagineProfil = caleImagine;
        await user.save();
        return res.status(200).json({message:"Imaginea a fost salvata!"});

    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
    }
}

const getImagineProfil = async(req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId || isNaN(userId)) {
            return res.status(404).json({ error: "ID utilizator invalid" });
        }        
        const user = await models.Utilizator.findByPk(userId);
        if (!user || !user.caleImagineProfil) {
            return res.status(404).json({ error: "Utilizatorul nu există sau nu are o imagine de profil." });
        }
        const caleAbsoluta = path.resolve(user.caleImagineProfil);
        return res.sendFile(caleAbsoluta);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getProfile = async (req, res) => {
    try {
      const userID = req.params.userID;
      if (!userID || isNaN(userID)) {
        return res.status(404).json({ error: "ID utilizator invalid" });
      }
      const user = await models.Utilizator.findByPk(userID, {
        attributes: [
          "username",
          "descriere",
          "dataInregistrare",
          "esteAdministrator",
          "poateCreaAnunt",
          "poateCreaForum",
          "poateTrimiteMesaj",
        ],
      });
      if (!user) {
        return res.status(404).json({ error: "Utilizatorul nu exista" });
      }
      const prefRecord = await models.Preferinte.findOne({
        where: { idUtilizator: userID },
        attributes: [
          "preferintaUnu",
          "preferintaDoi",
          "preferintaTrei",
          "preferintaPatru",
          "preferintaCinci",
        ],
        raw: true,
      });

      const preferences = prefRecord
        ? Object.values(prefRecord).filter((p) => p && p.trim() !== "")
        : [];
      return res.status(200).json({ user, preferences });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

const getArticles = async(req, res) => {
    try{
        const userID = req.params.userID;
        if (!userID || isNaN(userID)) {
          return res.status(404).json({ error: "ID utilizator invalid" });
        }
        const rawArticles = await models.AnuntBazar.findAll({
            where: {
                idUtilizator: userID
            }
        })
        const articles = rawArticles.map(anunt => ({
            id: anunt.id,
            titlu: anunt.titluAnunt,
            descriere: anunt.descriereAnunt,
            utilizator: anunt.Utilizator ? anunt.Utilizator.username : "Utilizator necunoscut",
            data: anunt.dataAnunt,
            negociabil: anunt.esteNegociabil,
            pret: anunt.pretAnunt
        }));
        return res.status(200).json(articles);
    }catch(error){
        return res.status(500).json({error});
    }
}

const getForums = async(req, res) => {
    try{
        const userID = req.params.userID;
        if (!userID || isNaN(userID)) {
          return res.status(404).json({ error: "ID utilizator invalid" });
        }
        const rawForums = await models.Forum.findAll({
            where: {
                idUtilizator: userID
            }
        })
        const forums = rawForums.map(forum => ({
            id:forum.id,
            titluForum:forum.titluForum,
            esteDeschis:forum.esteDeschis
        }))
        return res.status(200).json(forums);
    }catch(error){
        console.log(error);
        return res.status(500).json({error});
    }
}


export default { checkEmailExists, 
    checkUsernameTaken, 
    createUtilizator, 
    loginUtilizator, 
    getUtilizatorData, 
    updateUtilizatorDescriere, 
    updateUtilizatorParola, 
    uploadImagineProfil, 
    getImagineProfil,
    getProfile,
    getArticles,
    getForums
};

