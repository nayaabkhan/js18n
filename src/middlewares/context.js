/**
 *
 * @param {any} phrase The phrase to check for context data.
 * @param {object} params Additional parameters. We are mostly interested in the
 * "context" parameter.
 *
 * @returns {any} Matching context or default context if no match found.
 */
export default function context(phrase, key, params = {}) {
  // Give nphrase must be an object as the context matches are present as
  // subkeys of this phrase.
  if (typeof phrase !== 'object') {
    return phrase
  }

  if (
    params.hasOwnProperty('context') &&
    phrase.hasOwnProperty(params.context)
  ) {
    return phrase[params.context]
  } else if (phrase.hasOwnProperty('default')) {
    return phrase['default']
  } else {
    return phrase
  }
}
