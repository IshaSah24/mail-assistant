import express from 'express';
import createEmailResponse from '../controllers/createEmailResponse.js';


const router = express.Router();

router.post('/generate', createEmailResponse);

export default router;