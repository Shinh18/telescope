const express = require('express');
const path = require('path');

const admin = require('./admin');
const auth = require('./auth');
// The /feeds router allows access to Telescope's Feed Objects.
const feeds = require('./feeds');
// The /feed router allows access to generated feeds (RSS, ATOM, etc)
const feed = require('./feed');
const health = require('./health');
const planet = require('./planet');
const posts = require('./posts');
const serviceProvider = require('./service-provider');
const stats = require('./stats');
const user = require('./user');
const query = require('./query');

const router = express.Router();

/**
 * In staging and production, our reverse proxy takes care of serving the content in the public folder.
 * We're keeping this route for development.
 */
router.use(express.static(path.join(__dirname, '../../../frontend/public')));

// Legacy CDOT Planet static assets
router.use('/legacy', express.static(path.join(__dirname, '../planet/static')));

/**
 * In staging and production, all routes are being cached in our reverse proxy except for admin, user, health and auth.
 * Please check https://github.com/Seneca-CDOT/telescope/blob/master/nginx.conf for more details about it.
 */
router.use('/admin', admin);
router.use('/auth', auth);
router.use('/feeds', feeds);
router.use('/feed', feed);
router.use('/health', health);
router.use('/planet', planet);
router.use('/posts', posts);
router.use('/sp', serviceProvider);
router.use('/stats', stats);
router.use('/user', user);
router.use('/query', query);

module.exports = router;
