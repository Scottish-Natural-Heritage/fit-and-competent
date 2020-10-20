import {ReturnState} from './_base.js';

/**
 * Clean the incoming POST request body to make it more compatible with the
 * database and its validation rules.
 *
 * @param {object} body The incoming request's body.
 * @returns {any} A json object that's just got our cleaned up fields on it.
 */
const cleanInput = (body) => {
  return {
    // The string is trimmed for leading and trailing whitespace and then
    // copied across if they're in the POST body or are set to undefined if
    // they're missing.
    cleanRefereeName: body.refereeName === undefined ? undefined : body.refereeName.trim(),
    cleanRefereeEmail: body.refereeEmail === undefined ? undefined : body.refereeEmail.trim()
  };
};

const refereeController = (request) => {
  // Clear any existing errors.
  request.session.refereeError = false;

  request.session.refereeNameError = false;
  request.session.refereeEmailEmptyError = false;
  request.session.refereeEmailInvalidError = false;

  // Clean up the user's input before we use it.
  const {cleanRefereeName, cleanRefereeEmail} = cleanInput(request.body);

  // Save the referee details.
  request.session.refereeName = cleanRefereeName;
  request.session.refereeEmail = cleanRefereeEmail;

  request.session.refereeNameError = cleanRefereeName === undefined || cleanRefereeName.trim() === '';

  request.session.refereeEmailEmptyError = cleanRefereeEmail === undefined || cleanRefereeEmail.trim() === '';
  if (!request.session.refereeEmailEmptyError) {
    request.session.refereeEmailInvalidError =
      cleanRefereeEmail.trim().includes(' ') || !cleanRefereeEmail.includes('@');
  }

  // Check for any errors in the processing.
  request.session.refereeError =
    request.session.refereeNameError ||
    request.session.refereeEmailEmptyError ||
    request.session.refereeEmailInvalidError;

  // If we've seen an error in any of the fields, our visitor needs to go back
  // and fix them.
  if (request.session.refereeError) {
    return ReturnState.Error;
  }

  // The request passed all our validation, we've stored copies of everything we
  // need, so it's time to go on.
  return ReturnState.Positive;
};

export {refereeController as default};
