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

export {cleanYear, cleanMonth, cleanDay, cleanInt};
