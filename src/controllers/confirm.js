import {ReturnState} from './_base.js';

const confirmController = async (request) => {
  try {
    // Get our application object ready for submission.
    const newApp = {
      convictions: request.session.conviction,
      certificateNumber: request.session.certificateNumber,
      certificateIssuedDate: request.session.certificateIssuedDate,
      qualificationHeld: request.session.qualificationHeld,
      qualificationReference: request.session.qualificationRef,
      qualificationObtainedDate: request.session.qualificationDate,
      redExperience: request.session.redExperienceYears,
      redControl: request.session.redControlNumber,
      roeExperience: request.session.roeExperienceYears,
      roeControl: request.session.roeControlNumber,
      sikaExperience: request.session.sikaExperienceYears,
      sikaControl: request.session.sikaControlNumber,
      fallowExperience: request.session.fallowExperienceYears,
      fallowControl: request.session.fallowControlNumber,
      fullName: request.session.fullName,
      companyOrganisation: request.session.companyOrganisation,
      addressLine1: request.session.addressLine1,
      addressLine2: request.session.addressLine2,
      addressTown: request.session.addressTown,
      addressCounty: request.session.addressCounty,
      addressPostcode: request.session.addressPostcode,
      phoneNumber: request.session.phoneNumber,
      emailAddress: request.session.emailAddress,
      refereeName:
        request.session.refereeName && request.session.qualificationHeld === 'dsc1'
          ? request.session.refereeName
          : undefined,
      refereeEmail:
        request.session.refereeEmail && request.session.qualificationHeld === 'dsc1'
          ? request.session.refereeEmail
          : undefined,
      bestPractice: request.session.bestPractice
    };

    // Add HTTP request
    // Let them know it all went well.
    return ReturnState.Positive;
  } catch (error) {
    console.log(error);

    // Let the user know it went wrong, and to 'probably' try again?
    return ReturnState.Error;
  }
};

export {confirmController as default};
