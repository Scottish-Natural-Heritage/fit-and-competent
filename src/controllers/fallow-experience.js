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
    cleanFallowExperienceYears: cleanInt(body.fallowExperienceYears),
    cleanFallowControlNumber: cleanInt(body.fallowControlNumber)
  };
};

const fallowExperienceController = (request) => {
  // Clear any existing errors.
  request.session.experienceError = false;
  request.session.fallowSelectionError = false;
  request.session.fallowExperienceYearsEmptyError = false;
  request.session.fallowControlNumberEmptyError = false;
  request.session.fallowExperienceYearsInvalidError = false;
  request.session.fallowControlNumberInvalidError = false;
  request.session.fallowExperienceYearsLessThanError = false;

  if (request.body.fallow === '' || request.body.fallow === undefined) {
    request.session.fallowSelectionError = true;
  }

  if (request.body.fallow === 'yes') {
    // Clean up the user's input.
    const {cleanFallowExperienceYears, cleanFallowControlNumber} = cleanInput(request.body);
    request.session.fallow = 'yes';
    request.session.fallowExperienceYears = cleanFallowExperienceYears;
    request.session.fallowControlNumber = cleanFallowControlNumber;

    request.session.fallowExperienceYearsEmptyError =
      request.body.fallowExperienceYears === undefined || request.body.fallowExperienceYears.trim() === '';
    request.session.fallowControlNumberEmptyError =
      request.body.fallowControlNumber === undefined || request.body.fallowControlNumber.trim() === '';

    if (!request.session.fallowExperienceYearsEmptyError) {
      request.session.fallowExperienceYearsInvalidError = new RegExp(/\D/).test(
        request.body.fallowExperienceYears.trim()
      );
      request.session.fallowExperienceYearsLessThanError = Number.parseInt(request.body.fallowExperienceYears, 10) <= 0;
    }

    if (!request.session.fallowControlNumberEmptyError) {
      request.session.fallowControlNumberInvalidError = new RegExp(/\D/).test(request.body.fallowControlNumber.trim());
    }
  }

  if (request.body.fallow === 'no') {
    request.session.fallow = 'no';
    request.session.fallowExperienceYears = undefined;
    request.session.fallowControlNumber = undefined;
  }

  // Check for any errors in the processing.
  request.session.experienceError =
    request.session.fallowExperienceYearsEmptyError ||
    request.session.fallowControlNumberEmptyError ||
    request.session.fallowExperienceYearsInvalidError ||
    request.session.fallowControlNumberInvalidError ||
    request.session.fallowExperienceYearsLessThanError ||
    request.session.fallowSelectionError;

  // If we've seen an error in any of the fields, our visitor needs to go back
  // and fix them.
  if (request.session.experienceError) {
    return ReturnState.Error;
  }

  // The request passed all our validation, we've stofallow copies of everything we
  // need, so it's time to go on.
  return ReturnState.Positive;
};

export {fallowExperienceController as default};
