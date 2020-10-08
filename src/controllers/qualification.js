import {ReturnState} from './_base.js';

const qualificationController = (request) => {
  // Did the user tell us they want do a new application.
  if (request.body.qualificationHeld === 'dsc1') {
    // Then we don't have any errors. This clears any previous errors.
    request.session.qualificationHeldError = false;
    // Save the decision.
    request.session.qualificationHeld = 'dsc1';
    // Follow the 'new path'.
    return ReturnState.Positive;
  }

  // Did the user tell us they want do a new application.
  if (request.body.qualificationHeld === 'dsc2') {
    // Then we don't have any errors. This clears any previous errors.
    request.session.qualificationHeldError = false;
    // Save the decision.
    request.session.qualificationHeld = 'dsc2';
    // Follow the 'new path'.
    return ReturnState.Secondary;
  }

  // Did the user tell us they want do a new application.
  if (request.body.qualificationHeld === 'other') {
    // Then we don't have any errors. This clears any previous errors.
    request.session.qualificationHeldError = false;
    // Save the decision.
    request.session.qualificationHeld = 'other';
    // Follow the 'new path'.
    return ReturnState.Tertiary;
  }

  // The user submitted the form without selecting an option, this is an error!
  request.session.qualificationHeldError = true;
  // Unset any saved value.
  request.session.qualificationHeld = undefined;
  // Reload the page to highlight errors.
  return ReturnState.Error;
};

export {qualificationController as default};
