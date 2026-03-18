const { CertificationController } = require('../controllers/certificationController');
const { AuthMiddleware } = require('../middleware/authMiddleware');

const certificationRouter = require('express').Router();

const certificationController = new CertificationController();

certificationRouter.post('/',AuthMiddleware.requireAuth,certificationController.addCertification);
certificationRouter.get('/',AuthMiddleware.requireAuth,certificationController.getCertification);

module.exports={certificationRouter}