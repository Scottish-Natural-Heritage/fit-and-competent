import {ReturnState} from './_base.js';
import {cleanDay, cleanMonth, cleanYear} from './_util.js';

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
  const {cleanCertificateNumber, cleanCertificateIssuedYear, cleanCertificateIssuedMonth, cleanCertificateIssuedDay} =
    cleanInput(request.body);

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

    request.session.validationExpiredDateString = `${nowDate.getDate()} ${new Intl.DateTimeFormat('en-GB', {
      month: 'long'
    }).format(nowDate)} ${minDate.getFullYear()}`;
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
