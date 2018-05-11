export default function createTranslator(
  locale,
  preloadedResources = {},
  language
) {
  const replace = String.prototype.replace

  const dollarRegex = /\$/g
  const dollarBillsYall = '$$'
  const tokenRegex = /(?:\{\{|%\{)(.*?)(?:\}\}?)/gm

  const pluralOptions = ['zero', 'one', 'two', 'few', 'many', 'other']

  let currentResources = preloadedResources

  function getLocale() {
    return locale
  }

  function translate(key, params = {}) {
    let match = _findPhrase(key)

    if (!match) {
      if (params.hasOwnProperty('_')) {
        match = params._
      } else {
        return key
      }
    }

    while (typeof match !== 'string') {
      if (
        pluralOptions.reduce(
          (acc, option) => acc || match.hasOwnProperty(option),
          false
        )
      ) {
        match = _resolvePluralisation(match, params.count)
      } else {
        match = _resolveContext(match, params)
      }
    }

    return _interpolate(match, params)
  }

  function addResources(resources) {
    currentResources = Object.assign({}, currentResources, resources)
  }

  function _findPhrase(key) {
    const keyParts = key.split('.')

    return keyParts.reduce((submatch, part) => {
      return submatch[part]
    }, currentResources)
  }

  function _resolveContext(match, params) {
    if (
      params.hasOwnProperty('context') &&
      match.hasOwnProperty(params.context)
    ) {
      return match[params.context]
    }

    return match['default']
  }

  function _resolvePluralisation(match, count) {
    return language.pluralise(match, count)
  }

  function _interpolate(phrase, params = {}) {
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

  return {
    getLocale,
    translate,
    addResources,
  }
}
