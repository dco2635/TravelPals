
import express from 'express';
import path from 'path';
const router = express.Router();
router.route('/').get(async (req, res) => {
   res.render('newsFeed',{pageTitle:'News Feed'});
});
router.route('/addpost').get(async (req, res) => {
   res.render('post',{pageTitle:'Person Not found'});
});
router.route('/profile').get(async (req, res) => {
   res.render('profile',{pageTitle:'Person Not found'});
 });

 router.route('/logout').get(async (req, res) => {
   res.render('logout',{pageTitle:'Person Not found'});
});
export default router
