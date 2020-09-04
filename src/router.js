import express from 'express';
const router = express.Router();

// Import all the controllers.
import {Page} from './controllers/_base.js';
import StartController from './controllers/start.js';
import InformationController from './controllers/information.js';

// Configure all of the pages and routes.

router.use(
  Page({
    path: 'start',
    positiveForward: 'information',
    controller: StartController
  })
);

router.use(
  Page({
    path: 'information',
    back: 'start',
    controller: InformationController
  })
);

export {router as default};
