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
    cleanDsc2Number: body.dsc2Number === undefined ? undefined : body.dsc2Number.trim(),
    cleanDsc2Year: cleanYear(body.dsc2Year),
    cleanDsc2Month: cleanMonth(body.dsc2Month),
    cleanDsc2Day: cleanDay(body.dsc2Day)
  };
};

const dsc2DetailsController = (request) => {
  // Clear any existing errors.
  request.session.dsc2Error = false;
  request.session.emptyPageError = false;

  request.session.dsc2NumberError = false;
  request.session.dsc2LengthError = false;
  request.session.dsc2InvalidCharacterError = false;
  request.session.dsc2DateError = false;
  request.session.dsc2InvalidError = false;
  request.session.dsc2FutureError = false;
  request.session.dsc2YearError = false;
  request.session.dsc2MonthError = false;
  request.session.dsc2DayError = false;

  // Clean up the user's input before we use it.
  const {cleanDsc2Number, cleanDsc2Year, cleanDsc2Month, cleanDsc2Day} = cleanInput(request.body);

  // Save the qualifications details.
  request.session.qualificationRef = cleanDsc2Number;

  request.session.qualificationYear = cleanDsc2Year;
  request.session.qualificationMonth = cleanDsc2Month;
  request.session.qualificationDay = cleanDsc2Day;

  // Check for DSC 2 entry
  if (
    request.session.qualificationYear ||
    request.session.qualificationMonth ||
    request.session.qualificationDay ||
    request.session.qualificationRef
  ) {
    request.session.dsc2LengthError =
      cleanDsc2Number === undefined || cleanDsc2Number === '' || cleanDsc2Number.trim().length > 5;
    request.session.dsc2InvalidCharacterError = new RegExp(/\D/).test(cleanDsc2Number);

    request.session.dsc2YearError = cleanDsc2Year === undefined;
    request.session.dsc2MonthError = cleanDsc2Month === undefined;
    request.session.dsc2DayError = cleanDsc2Day === undefined;

    if (request.session.dsc2InvalidCharacterError || request.session.dsc2LengthError) {
      request.session.dsc2NumberError = true;
    }

    if (request.session.dsc2YearError || request.session.dsc2MonthError || request.session.dsc2DayError) {
      request.session.dsc2InvalidError = false;
      request.session.dsc2FutureError = false;
      request.session.dsc2DateError = true;
    } else {
      // Construct a date from our fields and see whether it's a valid date.
      const testDate = new Date(cleanDsc2Year, cleanDsc2Month - 1, cleanDsc2Day);
      request.session.dsc2InvalidError =
        testDate.getFullYear() !== cleanDsc2Year ||
        testDate.getMonth() + 1 !== cleanDsc2Month ||
        testDate.getDate() !== cleanDsc2Day;

      // Check the constructed date isn't in the future.
      const nowDate = new Date();
      request.session.dsc2FutureError = testDate > nowDate;

      if (!request.session.dsc2InvalidError && !request.session.dsc2FutureError) {
        // If there's no errors on the constructed date, save it for later.
        request.session.qualificationDate = testDate;
      } else {
        // If there is an error though, just clear that field.
        request.session.qualificationDate = undefined;
        request.session.dsc2DateError = true;
      }
    }
  }

  // If no data was entered
  if (
    !request.session.qualificationNumber &&
    !request.session.qualificationYear &&
    !request.session.qualificationMonth &&
    !request.session.qualificationDay
  ) {
    // If any individual fields were invalid, there's no point in even checking
    // these yet.
    request.session.emptyPageError = true;
  }

  // Check for any errors in the processing.
  request.session.dsc2Error =
    request.session.emptyPageError ||
    request.session.dsc2NumberError ||
    request.session.dsc2InvalidCharacterError ||
    request.session.dsc2InvalidError ||
    request.session.dsc2FutureError ||
    request.session.dsc2YearError ||
    request.session.dsc2MonthError ||
    request.session.dsc2DayError;

  // If we've seen an error in any of the fields, our visitor needs to go back
  // and fix them.
  if (request.session.dsc2Error) {
    return ReturnState.Error;
  }

  // The request passed all our validation, we've stored copies of everything we
  // need, so it's time to go on.
  return ReturnState.Positive;
};

export {dsc2DetailsController as default};
