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
  // Clear any existing errors.
  request.session.firearmError = false;
  request.session.certificateNumberError = false;
  request.session.certificateIssuedYearError = false;
  request.session.certificateIssuedMonthError = false;
  request.session.certificateIssuedDayError = false;
  request.session.certificateIssuedInvalidError = false;
  request.session.certificateIssuedFutureError = false;
  request.session.certificateIssuedExpiredError = false;
  request.session.certificateIssuedDateError = false;

  // Clean up the user's input before we use it.
  const {
    cleanCertificateNumber,
    cleanCertificateIssuedYear,
    cleanCertificateIssuedMonth,
    cleanCertificateIssuedDay
  } = cleanInput(request.body);

  // Save the certificate number.
  request.session.certificateNumber = cleanCertificateNumber;

  // Check the certificate number is 'valid'.
  request.session.certificateNumberError = cleanCertificateNumber === undefined || cleanCertificateNumber === '';

  // Save the certificate's issued date.
  request.session.certificateIssuedYear = cleanCertificateIssuedYear;
  request.session.certificateIssuedMonth = cleanCertificateIssuedMonth;
  request.session.certificateIssuedDay = cleanCertificateIssuedDay;

  // Check the certificate's issued date's fields were valid.
  request.session.certificateIssuedYearError = cleanCertificateIssuedYear === undefined;
  request.session.certificateIssuedMonthError = cleanCertificateIssuedMonth === undefined;
  request.session.certificateIssuedDayError = cleanCertificateIssuedDay === undefined;

  if (
    request.session.certificateIssuedYearError ||
    request.session.certificateIssuedMonthError ||
    request.session.certificateIssuedDayError
  ) {
    // If any individual fields were invalid, there's no point in even checking
    // these yet.
    request.session.certificateIssuedInvalidError = false;
    request.session.certificateIssuedFutureError = false;
    request.session.certificateIssuedExpiredError = false;
    request.session.certificateIssuedDateError = true;
  } else {
    // Construct a date from our fields and see whether it's a valid date.
    const testDate = new Date(cleanCertificateIssuedYear, cleanCertificateIssuedMonth - 1, cleanCertificateIssuedDay);
    request.session.certificateIssuedInvalidError =
      testDate.getFullYear() !== cleanCertificateIssuedYear ||
      testDate.getMonth() + 1 !== cleanCertificateIssuedMonth ||
      testDate.getDate() !== cleanCertificateIssuedDay;

    // Check the constructed date isn't in the future.
    const nowDate = new Date();
    request.session.certificateIssuedFutureError = testDate > nowDate;

    // Check the constructed date isn't more than 5 years ago.
    const minDate = new Date(nowDate.getFullYear() - 5, nowDate.getMonth(), nowDate.getDate());
    request.session.certificateIssuedExpiredError = testDate < minDate;

    if (
      !request.session.certificateIssuedInvalidError &&
      !request.session.certificateIssuedFutureError &&
      !request.session.certificateIssuedExpiredError
    ) {
      // If there's no errors on the constructed date, save it for later.
      request.session.certificateIssuedDate = testDate;
    } else {
      // If there is an error though, just clear that field.
      request.session.certificateIssuedDate = undefined;
      request.session.certificateIssuedDateError = true;
    }
  }

  // Check for any errors in the processing.
  request.session.firearmError =
    request.session.certificateNumberError ||
    request.session.certificateIssuedYearError ||
    request.session.certificateIssuedMonthError ||
    request.session.certificateIssuedDayError ||
    request.session.certificateIssuedInvalidError ||
    request.session.certificateIssuedFutureError ||
    request.session.certificateIssuedExpiredError ||
    request.session.certificateIssuedDateError;

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
