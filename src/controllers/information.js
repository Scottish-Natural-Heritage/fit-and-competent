import {ReturnState} from './_base.js';

const informationController = () => {
  // Much like the start page, the only way out of the information page is onwards,
  // so return success and continue the form.
  return ReturnState.Positive;
};

export {informationController as default};
