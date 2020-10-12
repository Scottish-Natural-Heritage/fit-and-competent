import express from 'express';
const router = express.Router();

// Import all the controllers.
import {Page} from './controllers/_base.js';
import StartController from './controllers/start.js';
import InformationController from './controllers/information.js';
import GdprController from './controllers/gdpr.js';
import ConvictionController from './controllers/conviction.js';
import FirearmController from './controllers/firearm.js';
import QualificationController from './controllers/qualification.js';
import Dsc1DetailsController from './controllers/dsc1-details.js';
import Dsc2DetailsController from './controllers/dsc2-details.js';
import OtherQualificationDetailsController from './controllers/other-qualification-details.js';
import RedExperienceController from './controllers/red-experience.js';

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
    positiveForward: 'firearm',
    controller: ConvictionController
  })
);

router.use(
  Page({
    path: 'firearm',
    back: 'conviction',
    positiveForward: 'qualification',
    controller: FirearmController
  })
);

router.use(
  Page({
    path: 'qualification',
    back: 'firearm',
    positiveForward: 'dsc1-details',
    secondaryForward: 'dsc2-details',
    tertiaryForward: 'other-qualification-details',
    controller: QualificationController
  })
);

router.use(
  Page({
    path: 'dsc1-details',
    back: 'qualification',
    positiveForward: 'red-experience',
    controller: Dsc1DetailsController
  })
);

router.use(
  Page({
    path: 'dsc2-details',
    back: 'qualification',
    positiveForward: 'red-experience',
    controller: Dsc2DetailsController
  })
);

router.use(
  Page({
    path: 'other-qualification-details',
    back: 'qualification',
    positiveForward: 'red-experience',
    controller: OtherQualificationDetailsController
  })
);

router.use(
  Page({
    path: 'red-experience',
    back: 'qualification',
    controller: RedExperienceController
  })
);

router.use(
  Page({
    path: 'conviction-stop',
    back: 'conviction'
  })
);

export {router as default};
