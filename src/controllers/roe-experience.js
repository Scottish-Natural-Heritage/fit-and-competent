import {ReturnState} from './_base.js';
import {cleanInt} from './_util.js';
/**
 * Clean the incoming POST request body to make it more compatible with the
 * database and its validation rules.
 *
 * @param {object} body The incoming request's body.
 * @returns {any} A json object that's just got our cleaned up fields on it.
 */
const cleanInput = (body) => {
  return {
    // Ensure the user has entered integers
    cleanRoeExperienceYears: cleanInt(body.roeExperienceYears),
    cleanRoeControlNumber: cleanInt(body.roeControlNumber)
  };
};

const roeExperienceController = (request) => {
  // Clear any existing errors.
  request.session.experienceError = false;
  request.session.roeSelectionError = false;
  request.session.roeExperienceYearsEmptyError = false;
  request.session.roeControlNumberEmptyError = false;
  request.session.roeExperienceYearsInvalidError = false;
  request.session.roeControlNumberInvalidError = false;
  request.session.roeExperienceYearsGreaterThanError = false;

  if (request.body.roe === '' || request.body.roe === undefined) {
    request.session.roeSelectionError = true;
  }

  if (request.body.roe === 'yes') {
    // Clean up the user's input.
    const {cleanRoeExperienceYears, cleanRoeControlNumber} = cleanInput(request.body);
    request.session.roe = 'yes';
    request.session.roeExperienceYears = cleanRoeExperienceYears;
    request.session.roeControlNumber = cleanRoeControlNumber;

    request.session.roeExperienceYearsEmptyError =
      request.body.roeExperienceYears === undefined || request.body.roeExperienceYears.trim() === '';
    request.session.roeControlNumberEmptyError =
      request.body.roeControlNumber === undefined || request.body.roeControlNumber.trim() === '';

    if (!request.session.roeExperienceYearsEmptyError) {
      request.session.roeExperienceYearsInvalidError = new RegExp(/\D/).test(request.body.roeExperienceYears.trim());
      request.session.roeExperienceYearsGreaterThanError = Number.parseInt(request.body.roeExperienceYears, 10) <= 0;
    }

    if (!request.session.roeControlNumberEmptyError) {
      request.session.roeControlNumberInvalidError = new RegExp(/\D/).test(request.body.roeControlNumber.trim());
    }
  }

  if (request.body.roe === 'no') {
    request.session.roe = 'no';
    request.session.roeExperienceYears = undefined;
    request.session.roeControlNumber = undefined;
  }

  // Check for any errors in the processing.
  request.session.experienceError =
    request.session.roeExperienceYearsEmptyError ||
    request.session.roeControlNumberEmptyError ||
    request.session.roeExperienceYearsInvalidError ||
    request.session.roeControlNumberInvalidError ||
    request.session.roeExperienceYearsGreaterThanError ||
    request.session.roeSelectionError;

  // If we've seen an error in any of the fields, our visitor needs to go back
  // and fix them.
  if (request.session.experienceError) {
    return ReturnState.Error;
  }

  // The request passed all our validation, we've storoe copies of everything we
  // need, so it's time to go on.
  return ReturnState.Positive;
};

export {roeExperienceController as default};
