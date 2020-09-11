import {ReturnState} from './_base.js';

/**
 * Process a string in to either it's integer `number` representation or return
 * `undefined`.
 *
 * @param {string | undefined} dirtyValue The user's supplied integer value.
 * @returns {number | undefined} The cleaned integer value.
 */
const cleanInt = (dirtyValue) => {
  // Check we've not been given `undefined`.
  if (dirtyValue === undefined) {
    return undefined;
  }

  // Check we've not been given an empty string.
  const trimmedValue = dirtyValue.trim();
  if (trimmedValue === '') {
    return undefined;
  }

  // Check we're only receiving digits, not text, negative numbers or floats.
  if (!/^\d+$/.test(trimmedValue)) {
    return undefined;
  }

  // Check it does actually parse correctly.
  const valueAsNumber = Number.parseInt(trimmedValue, 10);
  if (Number.isNaN(valueAsNumber)) {
    return undefined;
  }

  // Return the fully validated integer value.
  return valueAsNumber.valueOf();
};

/**
 * Clean a user supplied 'day' in to either a `number` or `undefined`.
 *
 * @param {string | undefined} dirtyDay The user's supplied day value.
 * @returns {number | undefined} The cleaned day value.
 */
const cleanDay = (dirtyDay) => {
  const dayAsNumber = cleanInt(dirtyDay);

  if (dayAsNumber === undefined) {
    return undefined;
  }

  if (dayAsNumber < 1) {
    return undefined;
  }

  if (dayAsNumber > 31) {
    return undefined;
  }

  return dayAsNumber;
};

/**
 * Clean a user supplied 'month' in to either a `number` or `undefined`.
 *
 * @param {string | undefined} dirtyMonth The user's supplied month value.
 * @returns {number | undefined} The cleaned month value.
 */
const cleanMonth = (dirtyMonth) => {
  const monthAsNumber = cleanInt(dirtyMonth);

  if (monthAsNumber === undefined) {
    return undefined;
  }

  if (monthAsNumber < 1) {
    return undefined;
  }

  if (monthAsNumber > 12) {
    return undefined;
  }

  return monthAsNumber;
};

/**
 * Clean a user supplied 'year' in to either a `number` or `undefined`.
 *
 * @param {string | undefined} dirtyYear The user's supplied year value.
 * @returns {number | undefined} The cleaned year value.
 */
const cleanYear = (dirtyYear) => {
  const yearAsNumber = cleanInt(dirtyYear);

  if (yearAsNumber === undefined) {
    return undefined;
  }

  if (yearAsNumber < 1000) {
    return undefined;
  }

  if (yearAsNumber > 9999) {
    return undefined;
  }

  return yearAsNumber;
};

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
    cleanCertificateNumber: body.certificateNumber === undefined ? undefined : body.certificateNumber.trim(),
    cleanCertificateIssuedYear: cleanYear(body.certificateIssuedYear),
    cleanCertificateIssuedMonth: cleanMonth(body.certificateIssuedMonth),
    cleanCertificateIssuedDay: cleanDay(body.certificateIssuedDay)
  };
};

const firearmController = (request) => {
  // Clean up the user's input before we store it in the session.
  const cleanForm = cleanInput(request.body);
  // Initialize dates for validation/error checking
  const nowDate = new Date();
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 5);

  request.session.certificateNumber = cleanForm.certificateNumber;
  request.session.certificateIssued = cleanForm.certificateIssued;

  request.session.certificateNumberError =
    request.session.certificateNumber === undefined || request.session.certificateNumber.trim() === '';
  // If issued date has returned from the cleanInput function as undefined.
  request.session.certificateIssuedError = request.session.certificateIssued === undefined;

  // If issued date has returned from the cleanInput function successfully but is greater than todays date.
  request.session.certificateIssuedFutureError =
    cleanForm.certificateIssued !== undefined && cleanForm.certificateIssued > nowDate;

  // If issued date has returned from the cleanInput function successfully but is more than five
  // years old from todays date.
  request.session.certificateIssuedExpiredError =
    cleanForm.certificateIssued !== undefined && cleanForm.certificateIssued < minDate;

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
