const express = require("express");
const { CertificationService } = require("../services/certificationService")

class CertificationController{
    constructor(){
        this.certificationService = new CertificationService()
    }

    addCertification = async (req, res, next) => {
        try {
            const { name, issuer, year, url} = req.body;
            const userId = req.user.userId;

            if (!name || !issuer || !year || !url) {
                return res.status(400).json({
                    status: "error",
                    message: "All fields (name, issuer, year, url) are required"
                });
            }

            const certification = await this.certificationService.addCertification(
                userId,
                name,
                issuer,
                year,
                url
            );

            res.status(201).json({
                status: "success",
                message: "Certification added successfully",
                certification
            });

        } catch (err) {
            next(err);
        }
    };

    getCertification = async(req,res,next)=>{
        try{
            const userId = req.user.userId;

            const certification = await this.certificationService.getCertification(userId);

            res.status(200).json({
                status:"success",
                message: "Certifications retrieved successfully",
                certification
            })


        }catch(err){
            next(err)
        }
    }

    deleteCertification = async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const { id } = req.params;

            const result = await this.certificationService.deleteCertification(userId, id);

            res.status(200).json({
                status: "success",
                message: result.message
            });
        } catch (err) {
            next(err);
        }
    };


    updateCertification = async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const { name, issuer, year,  url } = req.body;

       
            if (!id) {
                return res.status(400).json({
                    status: "error",
                    message: "Certification ID is required"
                });
            }

            if (!name || !issuer || !year || !url) {
                return res.status(400).json({
                    status: "error",
                    message: "All fields (name, issuer, year, url) are required"
                });
            }

            const certification = await this.certificationService.updateCertification(
                userId,
                id,
                name,
                issuer,
                year,
                url
            );

         
            if (!certification) {
                return res.status(404).json({
                    status: "error",
                    message: "Certification not found"
                });
            }

            res.status(200).json({
                status: "success",
                message: "Certification updated successfully",
                certification
            });

        } catch (err) {
            next(err);
        }
    };


    getAllCertifcations = async(req,res,next)=>{
        try{
            const result = await this.certificationService.getAllCertifications();
            res.status(200).json({
                status: "success",
                message: "Retreived All Certification successfully",
                allCert: result.allCert
            });
        }catch(err){
            console.log(err)
        }
    }


}

module.exports={CertificationController}