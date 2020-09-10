import {ReturnState} from './_base.js';

/**
 * Clean the incoming POST request body to make it more compatible with the
 * database and its validation rules.
 *
 * @param {object} body The incoming request's body.
 * @returns {any} A json object that's just got our cleaned up fields on it.
 */
const cleanInput = (body) => {
  // initialize a new date and then use the set full year method using the day month year in the request body.
  const initDate = new Date();
  initDate.setFullYear(body.year.trim(), body.month.trim()-1, body.day.trim())
  // date input separates captured data into three properties: day, month and year.
  // therefor there is a check needed to ensure all three properties have been provided.
  // if they have not been provided then it needs to set the date to undefined.
  // if all three properties have been provided it needs to then check that the values provided
  // can produce a valid date if so then set the date, if not then set the date to undefined.
  // the final check is to ensure the user has provided a valid date something like 01/01/2020
  // and not something like 31/02/2020.
  if(body.year.trim() === '' || body.month.trim() === '' || body.day.trim() === '' ||
     isNaN(new Date(body.year.trim(), body.month.trim(), body.day.trim())) ||
     (initDate.getDate() != body.day.trim()) || (initDate.getMonth()+ 1 != body.month.trim())) {
    var certificateIssued = undefined;
  } else {
    var certificateIssued = initDate;
  }

  return {
    // The string is trimmed for leading and trailing whitespace and then
    // copied across if they're in the POST body or are set to undefined if
    // they're missing.
    certificateNumber: body.certificateNumber === undefined ? undefined : body.certificateNumber.trim(),
    certificateIssued: certificateIssued === undefined ? undefined : certificateIssued
  };
};

const firearmController = (request) => {
  // Clean up the user's input before we store it in the session.
  const cleanForm = cleanInput(request.body);
  // initialize dates for validation/error checking
  const nowDate = new Date();
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 5);

  request.session.certificateNumber = cleanForm.certificateNumber;
  request.session.certificateIssued = cleanForm.certificateIssued;


  request.session.certificateNumberError = request.session.certificateNumber === undefined || request.session.certificateNumber.trim() === '';
  // If issued date has returned from the cleanInput function as undefined.
  request.session.certificateIssuedError =
    request.session.certificateIssued === undefined;

  // If issued date has returned from the cleanInput function successfully but is greater than todays date.
  request.session.certificateIssuedFutureError =
    cleanForm.certificateIssued !== undefined &&
    cleanForm.certificateIssued > nowDate;

  // If issued date has returned from the cleanInput function successfully but is more than five
  // years old from todays date.
  request.session.certificateIssuedExpiredError =
    cleanForm.certificateIssued !== undefined &&
    cleanForm.certificateIssued < minDate;

  // Check that any of the fields are invalid.
  request.session.firearmError =
    request.session.certificateNumberError ||
    request.session.certificateIssuedError ||
    request.session.certificateIssuedFutureError ||
    request.session.certificateIssuedExpiredError;

  // If we've seen an error in any of the fields, our visitor needs to go back
  // and fix them.
  if (request.session.firearmError) {
    return ReturnState.Error;
  }

  // The request passed all our validation, we've stored copies of everything we
  // need, so it's time to go on.
  return ReturnState.Positive;
};

export {firearmController as default};
