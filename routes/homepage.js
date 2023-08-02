
import express from 'express';
import path from 'path';
const router = express.Router();
router.route('/').get(async (req, res) => {
    
   res.send('Welcome to my page')
});
router.route('/search').get(async (req, res) => {
    res.send('Welcome to search')
 });
 router.route('')
export default router
