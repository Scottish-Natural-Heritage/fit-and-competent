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
    cleanDsc1Number: body.dsc1Number === undefined ? undefined : body.dsc1Number.trim(),
    cleanDsc1Year: cleanYear(body.dsc1Year),
    cleanDsc1Month: cleanMonth(body.dsc1Month),
    cleanDsc1Day: cleanDay(body.dsc1Day)
  };
};

const dsc1DetailsController = (request) => {
  // Clear any existing errors.
  request.session.dsc1Error = false;
  request.session.emptyPageError = false;

  request.session.dsc1NumberError = false;
  request.session.dsc1LengthError = false;
  request.session.dsc1InvalidCharacterError = false;
  request.session.dsc1DateError = false;
  request.session.dsc1InvalidError = false;
  request.session.dsc1FutureError = false;
  request.session.dsc1YearError = false;
  request.session.dsc1MonthError = false;
  request.session.dsc1DayError = false;

  // Clean up the user's input before we use it.
  const {cleanDsc1Number, cleanDsc1Year, cleanDsc1Month, cleanDsc1Day} = cleanInput(request.body);

  // Save the qualifications details.
  request.session.dsc1Number = cleanDsc1Number;

  request.session.dsc1Year = cleanDsc1Year;
  request.session.dsc1Month = cleanDsc1Month;
  request.session.dsc1Day = cleanDsc1Day;

  // Check for DSC 1 entry
  if (request.session.dsc1Year || request.session.dsc1Month || request.session.dsc1Day || request.session.dsc1Number) {
    request.session.dsc1LengthError =
      cleanDsc1Number === undefined || cleanDsc1Number === '' || cleanDsc1Number.trim().length > 5;
    request.session.dsc1InvalidCharacterError = new RegExp(/\D/).test(cleanDsc1Number);

    request.session.dsc1YearError = cleanDsc1Year === undefined;
    request.session.dsc1MonthError = cleanDsc1Month === undefined;
    request.session.dsc1DayError = cleanDsc1Day === undefined;

    if (request.session.dsc1InvalidCharacterError || request.session.dsc1LengthError) {
      request.session.dsc1NumberError = true;
    }

    if (request.session.dsc1YearError || request.session.dsc1MonthError || request.session.dsc1DayError) {
      request.session.dsc1InvalidError = false;
      request.session.dsc1FutureError = false;
      request.session.dsc1DateError = true;
    } else {
      // Construct a date from our fields and see whether it's a valid date.
      const testDate = new Date(cleanDsc1Year, cleanDsc1Month - 1, cleanDsc1Day);
      request.session.dsc1InvalidError =
        testDate.getFullYear() !== cleanDsc1Year ||
        testDate.getMonth() + 1 !== cleanDsc1Month ||
        testDate.getDate() !== cleanDsc1Day;

      // Check the constructed date isn't in the future.
      const nowDate = new Date();
      request.session.dsc1FutureError = testDate > nowDate;

      if (!request.session.dsc1InvalidError && !request.session.dsc1FutureError) {
        // If there's no errors on the constructed date, save it for later.
        request.session.dsc1Date = testDate;
      } else {
        // If there is an error though, just clear that field.
        request.session.dsc1Date = undefined;
        request.session.dsc1DateError = true;
      }
    }
  }

  // If no data was entered
  if (
    !request.session.dsc1Number &&
    !request.session.dsc1Year &&
    !request.session.dsc1Month &&
    !request.session.dsc1Day
  ) {
    // If any individual fields were invalid, there's no point in even checking
    // these yet.
    request.session.emptyPageError = true;
  }

  // Check for any errors in the processing.
  request.session.dsc1Error =
    request.session.emptyPageError ||
    request.session.dsc1NumberError ||
    request.session.dsc1InvalidCharacterError ||
    request.session.dsc1InvalidError ||
    request.session.dsc1FutureError ||
    request.session.dsc1YearError ||
    request.session.dsc1MonthError ||
    request.session.dsc1DayError;

  // If we've seen an error in any of the fields, our visitor needs to go back
  // and fix them.
  if (request.session.dsc1Error) {
    return ReturnState.Error;
  }

  // The request passed all our validation, we've stored copies of everything we
  // need, so it's time to go on.
  return ReturnState.Positive;
};

export {dsc1DetailsController as default};
