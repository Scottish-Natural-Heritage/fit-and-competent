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
    cleanDsc1Number: body.dsc1Number === undefined ? undefined : body.dsc1Number.trim(),
    cleanDsc1Year: cleanYear(body.dsc1Year),
    cleanDsc1Month: cleanMonth(body.dsc1Month),
    cleanDsc1Day: cleanDay(body.dsc1Day),
    cleanDsc2Number: body.dsc2Number === undefined ? undefined : body.dsc2Number.trim(),
    cleanDsc2Year: cleanYear(body.dsc2Year),
    cleanDsc2Month: cleanMonth(body.dsc2Month),
    cleanDsc2Day: cleanDay(body.dsc2Day),
    cleanOtherName: body.otherName === undefined ? undefined : body.otherName.trim(),
    cleanOtherYear: cleanYear(body.otherYear),
    cleanOtherMonth: cleanMonth(body.otherMonth),
    cleanOtherDay: cleanDay(body.otherDay)
  };
};

const qualificationController = (request) => {
  // Clear any existing errors.
  request.session.qualificationError = false;
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

  request.session.dsc2NumberError = false;
  request.session.dsc2LengthError = false;
  request.session.dsc2InvalidCharacterError = false;
  request.session.dsc2DateError = false;
  request.session.dsc2InvalidError = false;
  request.session.dsc2FutureError = false;
  request.session.dsc2YearError = false;
  request.session.dsc2MonthError = false;
  request.session.dsc2DayError = false;

  request.session.otherNameError = false;
  request.session.otherNameEmptyError = false;
  request.session.otherDateError = false;
  request.session.otherInvalidError = false;
  request.session.otherFutureError = false;
  request.session.otherYearError = false;
  request.session.otherMonthError = false;
  request.session.otherDayError = false;
  // Clean up the user's input before we use it.
  const {
    cleanDsc1Number,
    cleanDsc1Year,
    cleanDsc1Month,
    cleanDsc1Day,
    cleanDsc2Number,
    cleanDsc2Year,
    cleanDsc2Month,
    cleanDsc2Day,
    cleanOtherName,
    cleanOtherYear,
    cleanOtherMonth,
    cleanOtherDay
  } = cleanInput(request.body);

  // Save the qualifications numbers.
  request.session.dsc1Number = cleanDsc1Number;
  request.session.dsc2Number = cleanDsc2Number;
  request.session.otherName = cleanOtherName;

  // Save the qualification's dates.
  request.session.dsc1Year = cleanDsc1Year;
  request.session.dsc1Month = cleanDsc1Month;
  request.session.dsc1Day = cleanDsc1Day;

  request.session.dsc2Year = cleanDsc2Year;
  request.session.dsc2Month = cleanDsc2Month;
  request.session.dsc2Day = cleanDsc2Day;

  request.session.otherYear = cleanOtherYear;
  request.session.otherMonth = cleanOtherMonth;
  request.session.otherDay = cleanOtherDay;

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

  // Check for DSC 2 entry
  if (request.session.dsc2Year || request.session.dsc2Month || request.session.dsc2Day || request.session.dsc2Number) {
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
        request.session.dsc2Date = testDate;
      } else {
        // If there is an error though, just clear that field.
        request.session.dsc2Date = undefined;
        request.session.dsc2DateError = true;
      }
    }
  }

  // Check for other qualification entry
  if (
    request.session.otherYear ||
    request.session.otherMonth ||
    request.session.otherDay ||
    request.session.otherName
  ) {
    request.session.otherNameEmptyError = cleanOtherName === undefined || cleanOtherName === '';
    request.session.otherYearError = cleanOtherYear === undefined;
    request.session.otherMonthError = cleanOtherMonth === undefined;
    request.session.otherDayError = cleanOtherDay === undefined;

    if (request.session.otherNameEmptyError) {
      request.session.otherNameError = true;
    }

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
    !request.session.dsc1Number &&
    !request.session.dsc2Number &&
    !request.session.otherName &&
    !request.session.dsc1Year &&
    !request.session.dsc1Month &&
    !request.session.dsc1Day &&
    !request.session.dsc2Year &&
    !request.session.dsc2Month &&
    !request.session.dsc2Day &&
    !request.session.otherYear &&
    !request.session.otherMonth &&
    !request.session.otherDay
  ) {
    // If any individual fields were invalid, there's no point in even checking
    // these yet.
    request.session.emptyPageError = true;
  }

  // Check for any errors in the processing.
  request.session.qualificationError =
    request.session.emptyPageError ||
    request.session.dsc1Error ||
    request.session.dsc1NumberError ||
    request.session.dsc1InvalidCharacterError ||
    request.session.dsc1InvalidError ||
    request.session.dsc1FutureError ||
    request.session.dsc1YearError ||
    request.session.dsc1MonthError ||
    request.session.dsc1DayError ||
    request.session.dsc2Error ||
    request.session.dsc2NumberError ||
    request.session.dsc2InvalidCharacterError ||
    request.session.dsc2InvalidError ||
    request.session.dsc2FutureError ||
    request.session.dsc2YearError ||
    request.session.dsc2MonthError ||
    request.session.dsc2DayError ||
    request.session.otherError ||
    request.session.otherNameError ||
    request.session.otherInvalidError ||
    request.session.otherFutureError ||
    request.session.otherYearError ||
    request.session.otherMonthError ||
    request.session.otherDayError;

  // If we've seen an error in any of the fields, our visitor needs to go back
  // and fix them.
  if (request.session.qualificationError) {
    return ReturnState.Error;
  }

  // The request passed all our validation, we've stored copies of everything we
  // need, so it's time to go on.
  return ReturnState.Positive;
};

export {qualificationController as default};
