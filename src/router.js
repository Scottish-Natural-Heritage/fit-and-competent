import express from 'express';
const router = express.Router();

// Import all the controllers.
import {Page} from './controllers/_base.js';
import StartController from './controllers/start.js';
import InformationController from './controllers/information.js';
import GdprController from './controllers/gdpr.js';
import ConvictionController from './controllers/conviction.js';

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
    positiveForward: 'gdpr',
    controller: InformationController
  })
);

router.use(
  Page({
    path: 'gdpr',
    back: 'information',
    positiveForward: 'conviction',
    controller: GdprController
  })
);

router.use(
  Page({
    path: 'conviction',
    back: 'gdpr',
    negativeForward: 'conviction-stop',
    controller: ConvictionController
  })
);

router.use(
  Page({
    path: 'conviction-stop',
    back: 'conviction'
  })
);

export {router as default};
