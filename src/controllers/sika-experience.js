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
    cleanSikaExperienceYears: cleanInt(body.sikaExperienceYears),
    cleanSikaControlNumber: cleanInt(body.sikaControlNumber)
  };
};

const sikaExperienceController = (request) => {
  // Clear any existing errors.
  request.session.experienceError = false;
  request.session.sikaSelectionError = false;
  request.session.sikaExperienceYearsEmptyError = false;
  request.session.sikaControlNumberEmptyError = false;
  request.session.sikaExperienceYearsInvalidError = false;
  request.session.sikaControlNumberInvalidError = false;

  if (request.body.sika === '' || request.body.sika === undefined) {
    request.session.sikaSelectionError = true;
  }

  if (request.body.sika === 'yes') {
    // Clean up the user's input.
    const {cleanSikaExperienceYears, cleanSikaControlNumber} = cleanInput(request.body);
    request.session.sika = 'yes';
    request.session.sikaExperienceYears = cleanSikaExperienceYears;
    request.session.sikaControlNumber = cleanSikaControlNumber;

    request.session.sikaExperienceYearsEmptyError =
      request.body.sikaExperienceYears === undefined || request.body.sikaExperienceYears.trim() === '';
    request.session.sikaControlNumberEmptyError =
      request.body.sikaControlNumber === undefined || request.body.sikaControlNumber.trim() === '';

    if (!request.session.sikaExperienceYearsEmptyError) {
      request.session.sikaExperienceYearsInvalidError = new RegExp(/\D/).test(request.body.sikaExperienceYears.trim());
    }

    if (!request.session.sikaControlNumberEmptyError) {
      request.session.sikaControlNumberInvalidError = new RegExp(/\D/).test(request.body.sikaControlNumber.trim());
    }
  }

  if (request.body.sika === 'no') {
    request.session.sika = 'no';
    request.session.sikaExperienceYears = undefined;
    request.session.sikaControlNumber = undefined;
  }

  // Check for any errors in the processing.
  request.session.experienceError =
    request.session.sikaExperienceYearsEmptyError ||
    request.session.sikaControlNumberEmptyError ||
    request.session.sikaExperienceYearsInvalidError ||
    request.session.sikaControlNumberInvalidError ||
    request.session.sikaSelectionError;

  // If we've seen an error in any of the fields, our visitor needs to go back
  // and fix them.
  if (request.session.experienceError) {
    return ReturnState.Error;
  }

  // The request passed all our validation, we've stosika copies of everything we
  // need, so it's time to go on.
  return ReturnState.Positive;
};

export {sikaExperienceController as default};
