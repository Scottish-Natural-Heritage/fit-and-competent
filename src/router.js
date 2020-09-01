import express from 'express';
const router = express.Router();

// Import all the controllers.
import {Page} from './controllers/_base.js';
import StartController from './controllers/start.js';

// Configure all of the pages and routes.

router.use(
  Page({
    path: 'start',
    controller: StartController
  })
);

export {router as default};
