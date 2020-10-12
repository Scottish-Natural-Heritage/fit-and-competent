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
    // Ensure the user has entered integers
    cleanRedExperienceYears: body.redExperienceYears === undefined ? undefined : body.redExperienceYears.trim(),
    cleanRedControlNumber: body.redControlNumber === undefined ? undefined : body.redControlNumber.trim()
  };
};

const redExperienceController = (request) => {
  // Clear any existing errors.
  request.session.experienceError = false;
  request.session.redSelectionError = false;
  request.session.redEmptyError = false;
  request.session.redExperienceYearsInvalidError = false;
  request.session.redControlNumberInvalidError = false;

  if (request.body.red === '' || request.body.red === undefined) {
    request.session.redSelectionError = true;
  }

  if (request.body.red === 'yes') {
    // Clean up the user's input before we use it.
    const {cleanRedExperienceYears, cleanRedControlNumber} = cleanInput(request.body);
    request.session.red = 'yes';
    request.session.redExperienceYears = cleanRedExperienceYears;
    request.session.redControlNumber = cleanRedControlNumber;

    if (request.session.redExperienceYears) {
      request.session.redExperienceYearsInvalidError = new RegExp(/\D/).test(cleanRedExperienceYears);
    }

    if (request.session.redControlNumber) {
      request.session.redControlNumberInvalidError = new RegExp(/\D/).test(cleanRedControlNumber);
    }

    if (request.session.redExperienceYears === '' && request.session.redControlNumber === '') {
      request.session.redEmptyError = true;
    }
  }

  if (request.body.red === 'no') {
    request.session.red = 'no';
    request.session.redExperienceYears = undefined;
    request.session.redControlNumber = undefined;
  }

  // Check for any errors in the processing.
  request.session.experienceError =
    request.session.redEmptyError ||
    request.session.redExperienceYearsInvalidError ||
    request.session.redControlNumberInvalidError ||
    request.session.redSelectionError;

  // If we've seen an error in any of the fields, our visitor needs to go back
  // and fix them.
  if (request.session.experienceError) {
    return ReturnState.Error;
  }

  // The request passed all our validation, we've stored copies of everything we
  // need, so it's time to go on.
  return ReturnState.Positive;
};

export {redExperienceController as default};
