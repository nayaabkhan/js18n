const replace = String.prototype.replace

const dollarRegex = /\$/g
const dollarBillsYall = '$$'
const tokenRegex = /(?:\{\{|%\{)(.*?)(?:\}\}?)/gm

/**
 *
 * @param {string} phrase The phrase to be interpolated.
 * @param {object} params Additional parameters. We are mainly interested in the
 * matching tokens for interpolation.
 *
 * @returns {string} Final string by interpolating phrase with given values.
 */
export default function interpolate(phrase, key, params = {}) {
  // Can only interpolate strings.
  if (typeof phrase !== 'string') {
    return phrase
  }

  const matchedPlaceholders = phrase.match(tokenRegex)

  let result = phrase
  result = replace.call(result, tokenRegex, function(expression, argument) {
    if (!params.hasOwnProperty(argument) || params[argument] == null) {
      return expression
    }
    return replace.call(params[argument], dollarRegex, dollarBillsYall)
  })

  return result
}
