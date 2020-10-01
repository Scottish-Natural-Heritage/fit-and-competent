import {ReturnState} from './_base.js';

const amendOrRenewController = (request) => {
  // Did the user tell us they want do a new application.
  if (request.body.applicationType === 'new') {
    // Then we don't have any errors. This clears any previous errors.
    request.session.applicationTypeError = false;
    // Save the decision.
    request.session.applicationType = 'new';
    // Follow the 'new path'.
    return ReturnState.Positive;
  }

  // The user submitted the form without selecting an option, this is an error!
  request.session.applicationTypeError = true;
  // Unset any saved value.
  request.session.applicationType = undefined;
  // Reload the page to highlight errors.
  return ReturnState.Error;
};

export {amendOrRenewController as default};
