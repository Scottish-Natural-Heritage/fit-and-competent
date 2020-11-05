import {ReturnState} from './_base.js';
import {cleanInt} from './_util.js';

const buildDisplayExperience = (session) => {
  const table = [];

  table.push(`
    <table class="govuk-table">
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th scope="col" class="govuk-table__header">Deer Species</th>
          <th scope="col" class="govuk-table__header">Experience Controlling</th>
          <th scope="col" class="govuk-table__header">Years experience</th>
          <th scope="col" class="govuk-table__header">Number controlled in the last 5 years</th>
        </tr>
      </thead>
      <tbody class="govuk-table__body">
  `);

  table.push(`
      <tr class="govuk-table__row">
        <th scope="row" class="govuk-table__header">Red</th>
        <td class="govuk-table__cell">${session.red}</td>
        <td class="govuk-table__cell">${session.redExperienceYears ? session.redExperienceYears : '-'} </td>
        <td class="govuk-table__cell">${session.redControlNumber ? session.redControlNumber : '-'}</td>
      </tr>
      <tr class="govuk-table__row">
        <th scope="row" class="govuk-table__header">Roe</th>
        <td class="govuk-table__cell">${session.roe}</td>
        <td class="govuk-table__cell">${session.roeExperienceYears ? session.roeExperienceYears : '-'}</td>
        <td class="govuk-table__cell">${session.roeControlNumber ? session.roeControlNumber : '-'}</td>
      </tr>
      <tr class="govuk-table__row">
        <th scope="row" class="govuk-table__header">Sika</th>
        <td class="govuk-table__cell">${session.sika}</td>
        <td class="govuk-table__cell">${session.sikaExperienceYears ? session.sikaExperienceYears : '-'}</td>
        <td class="govuk-table__cell">${session.sikaControlNumber ? session.sikaControlNumber : '-'}</td>
      </tr>
      <tr class="govuk-table__row">
        <th scope="row" class="govuk-table__header">Fallow</th>
        <td class="govuk-table__cell">${session.fallow}</td>
        <td class="govuk-table__cell">${session.fallowExperienceYears ? session.fallowExperienceYears : '-'}</td>
        <td class="govuk-table__cell">${session.fallowControlNumber ? session.fallowControlNumber : '-'}</td>
      </tr>`);

  table.push(`
      </tbody>
    </table>
  `);

  return table.join('');
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
    // Ensure the user has entered integers
    cleanFallowExperienceYears: cleanInt(body.fallowExperienceYears),
    cleanFallowControlNumber: cleanInt(body.fallowControlNumber)
  };
};

const fallowExperienceController = (request) => {
  // Clear any existing errors.
  request.session.experienceError = false;
  request.session.fallowSelectionError = false;
  request.session.fallowExperienceYearsEmptyError = false;
  request.session.fallowControlNumberEmptyError = false;
  request.session.fallowExperienceYearsInvalidError = false;
  request.session.fallowControlNumberInvalidError = false;
  request.session.fallowExperienceYearsLessThanError = false;

  if (request.body.fallow === '' || request.body.fallow === undefined) {
    request.session.fallowSelectionError = true;
  }

  if (request.body.fallow === 'yes') {
    // Clean up the user's input.
    const {cleanFallowExperienceYears, cleanFallowControlNumber} = cleanInput(request.body);
    request.session.fallow = 'yes';
    request.session.fallowExperienceYears = cleanFallowExperienceYears;
    request.session.fallowControlNumber = cleanFallowControlNumber;

    request.session.fallowExperienceYearsEmptyError =
      request.body.fallowExperienceYears === undefined || request.body.fallowExperienceYears.trim() === '';
    request.session.fallowControlNumberEmptyError =
      request.body.fallowControlNumber === undefined || request.body.fallowControlNumber.trim() === '';

    if (!request.session.fallowExperienceYearsEmptyError) {
      request.session.fallowExperienceYearsInvalidError = new RegExp(/\D/).test(
        request.body.fallowExperienceYears.trim()
      );
      request.session.fallowExperienceYearsLessThanError = Number.parseInt(request.body.fallowExperienceYears, 10) <= 0;
    }

    if (!request.session.fallowControlNumberEmptyError) {
      request.session.fallowControlNumberInvalidError = new RegExp(/\D/).test(request.body.fallowControlNumber.trim());
    }
  }

  if (request.body.fallow === 'no') {
    request.session.fallow = 'no';
    request.session.fallowExperienceYears = undefined;
    request.session.fallowControlNumber = undefined;
  }

  // Check for any errors in the processing.
  request.session.experienceError =
    request.session.fallowExperienceYearsEmptyError ||
    request.session.fallowControlNumberEmptyError ||
    request.session.fallowExperienceYearsInvalidError ||
    request.session.fallowControlNumberInvalidError ||
    request.session.fallowExperienceYearsLessThanError ||
    request.session.fallowSelectionError;

  // If we've seen an error in any of the fields, our visitor needs to go back
  // and fix them.
  if (request.session.experienceError) {
    return ReturnState.Error;
  }

  request.session.displayExperience = buildDisplayExperience(request.session);

  // The request passed all our validation, we've stofallow copies of everything we
  // need, so it's time to go on.
  return ReturnState.Positive;
};

export {fallowExperienceController as default};
