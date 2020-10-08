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
    cleanOtherName: body.otherName === undefined ? undefined : body.otherName.trim(),
    cleanOtherYear: cleanYear(body.otherYear),
    cleanOtherMonth: cleanMonth(body.otherMonth),
    cleanOtherDay: cleanDay(body.otherDay)
  };
};

const otherQualificationDetailsController = (request) => {
  // Clear any existing errors.
  request.session.otherQualificationError = false;
  request.session.emptyPageError = false;

  request.session.otherNameError = false;
  request.session.otherDateError = false;
  request.session.otherInvalidError = false;
  request.session.otherFutureError = false;
  request.session.otherYearError = false;
  request.session.otherMonthError = false;
  request.session.otherDayError = false;
  // Clean up the user's input before we use it.
  const {cleanOtherName, cleanOtherYear, cleanOtherMonth, cleanOtherDay} = cleanInput(request.body);

  // Save the qualifications details.
  request.session.otherName = cleanOtherName;
  request.session.otherYear = cleanOtherYear;
  request.session.otherMonth = cleanOtherMonth;
  request.session.otherDay = cleanOtherDay;

  // Check for other qualification entry
  if (
    request.session.otherYear ||
    request.session.otherMonth ||
    request.session.otherDay ||
    request.session.otherName
  ) {
    request.session.otherNameError = cleanOtherName === undefined || cleanOtherName === '';
    request.session.otherYearError = cleanOtherYear === undefined;
    request.session.otherMonthError = cleanOtherMonth === undefined;
    request.session.otherDayError = cleanOtherDay === undefined;

    if (request.session.otherYearError || request.session.otherMonthError || request.session.otherDayError) {
      request.session.otherInvalidError = false;
      request.session.otherFutureError = false;
      request.session.otherDateError = true;
    } else {
      // Construct a date from our fields and see whether it's a valid date.
      const testDate = new Date(cleanOtherYear, cleanOtherMonth - 1, cleanOtherDay);
      request.session.otherInvalidError =
        testDate.getFullYear() !== cleanOtherYear ||
        testDate.getMonth() + 1 !== cleanOtherMonth ||
        testDate.getDate() !== cleanOtherDay;

      // Check the constructed date isn't in the future.
      const nowDate = new Date();
      request.session.otherFutureError = testDate > nowDate;

      if (!request.session.otherInvalidError && !request.session.otherFutureError) {
        // If there's no errors on the constructed date, save it for later.
        request.session.otherDate = testDate;
      } else {
        // If there is an error though, just clear that field.
        request.session.otherDate = undefined;
        request.session.otherDateError = true;
      }
    }
  }

  // If no data was entered
  if (
    !request.session.otherName &&
    !request.session.otherYear &&
    !request.session.otherMonth &&
    !request.session.otherDay
  ) {
    // If any individual fields were invalid, there's no point in even checking
    // these yet.
    request.session.emptyPageError = true;
  }

  // Check for any errors in the processing.
  request.session.otherQualificationError =
    request.session.emptyPageError ||
    request.session.otherNameError ||
    request.session.otherInvalidError ||
    request.session.otherFutureError ||
    request.session.otherYearError ||
    request.session.otherMonthError ||
    request.session.otherDayError;

  // If we've seen an error in any of the fields, our visitor needs to go back
  // and fix them.
  if (request.session.otherQualificationError) {
    return ReturnState.Error;
  }

  // The request passed all our validation, we've stored copies of everything we
  // need, so it's time to go on.
  return ReturnState.Positive;
};

export {otherQualificationDetailsController as default};
