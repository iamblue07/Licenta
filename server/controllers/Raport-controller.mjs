import models from "../models/index.mjs";
import dotenv from 'dotenv';
import { Sequelize } from "sequelize";

dotenv.config();

const creeazaRaport = async(req, res) => {
    try{
        const userId = req.user.id;
        if(!userId || isNaN(userId)) {
            return res.status(404).json({error:"Missing or invalid user ID"});
        }
        const {idObiect, tipObiect, descriereRaport} = req.body;
        await models.Raport.create({
            obiectRaport: tipObiect,
            idObiect: idObiect,
            descriere: descriereRaport,
            esteDeschis: true,
            idRaportor: userId,
            dataRaport: new Date()
        })
        return res.status(200).json({message: "Success"});
    }catch(error){
        return res.status(500).json({error:"Internal Server Error"});
    }
}

const getReportsIDs = async(req,res) => {
    try{
        const {currentPage, viewOpenClosedReports, itemsPerPage} = req.body;

        const page = currentPage > 0 ? currentPage : 1;
        const limit = itemsPerPage > 0 ? itemsPerPage : 10;
        const offset = (page - 1) * limit;

        const reports = await models.Raport.findAll({
            attributes: ['id'],
            where: {
                esteDeschis: viewOpenClosedReports
            },
            order: [['dataRaport', 'DESC']],
            limit,
            offset
        });
        const ids = reports.map(report => report.id);
        const totalIDs = await models.Raport.count({ where: { esteDeschis: viewOpenClosedReports } });

        return res.status(200).json({ids, totalIDs});
    }catch(error){
        return res.status(500).json({error:"Internal Server Error"});
    }
}

const getReportData = async(req, res) => {
    try{
        const userId = req.user.id;
        if(!userId || isNaN(userId)) {
            return res.status(401).json({error:"Invalid user token"});
        }
        const user = await models.Utilizator.findByPk(userId);
        if(!user) {
            return res.status(404).json({error:"Missing user"});
        }
        if(user.esteAdministrator === false) {
            return res.status(400).json({error:"Ilegal Request: User not admin"});
        }
        const {raportID} = req.params;
        if(!raportID || isNaN(raportID)) {
            return res.status(404).json({error:"Invalid report ID"});
        }
        const report = await models.Raport.findByPk(raportID);
        return res.status(200).json(report);
    }catch(error){
        console.log(error);
        return res.status(500).json({error:"Internal Server Error"});
    }
}

const getExtendedReportData = async(req, res) => {
    try{
        const userId = req.user.id;
        if(!userId || isNaN(userId)) {
            return res.status(404).json({error:"Missing user ID"});
        }
        const user = await models.Utilizator.findByPk(userId);
        if(!user) {
            return res.status(404).json({error:"Missing user"});
        }
        if(user.esteAdministrator === false) {
            return res.status(400).json({error:"ILEGAL REQUEST: USER NOT ADMINISTRATOR"})
        }
        const {raportID} = req.params;
        if(!raportID || isNaN(raportID)) {
            return res.status(404).json({error:"Missing raport ID"});
        }
        const raport = await models.Raport.findByPk(raportID);
        var data;
        if(raport.obiectRaport === "MesajChat") {
            data = await models.MesajChat.findByPk(raport.idObiect, {
                attributes: ['id', 'idUtilizator', 'idChat', 'esteMedia', 'continut', 'data']
            });

        }
        if(raport.obiectRaport === "MesajForum") {
            data = await models.MesajForum.findByPk(raport.idObiect, {
                attributes: ['id', 'idUtilizator', 'continut', 'data']
            });
        }
        if(raport.obiectRaport === "Forum") {
            data = await models.Forum.findByPk(raport.idObiect, {
                attributes: ['id', 'idUtilizator', 'titluForum', 'data']
            });
        }
        if(raport.obiectRaport === "Anunt") {
            data = await models.AnuntBazar.findByPk(raport.idObiect, {
                attributes: ['id', 'idUtilizator', 'titluAnunt', 'descriereAnunt', 'dataAnunt']
            })
        }
        const reportedUser = await models.Utilizator.findByPk(data.idUtilizator, {
            attributes: ['username']
        });
        const reporterUser = await models.Utilizator.findByPk(raport.idRaportor, {
            attributes: ['username']
        });
        return res.status(200).json({data, reportedUsername: reportedUser.username, reporterUsername: reporterUser.username});
    }catch(error){
        return res.status(500).json({error:"Internal Server Error"});
    }
}

export default {
    creeazaRaport,
    getReportsIDs,
    getReportData,
    getExtendedReportData
}