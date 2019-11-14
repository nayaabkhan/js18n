import forEach from '../utils/forEach'

const split = String.prototype.split
const pluralOptions = ['zero', 'one', 'two', 'few', 'many', 'other']

// Mapping from pluralization group plural logic.
const pluralTypes = {
  arabic: function(n) {
    // http://www.arabeyes.org/Plural_Forms
    if (n < 3) {
      return n
    }
    if (n % 100 >= 3 && n % 100 <= 10) return 3
    return n % 100 >= 11 ? 4 : 5
  },
  chinese: function() {
    return 5
  },
  german: function(n) {
    return n < 2 ? n : 5
  },
  french: function(n) {
    return n > 1 ? 5 : 1
  },
  russian: function(n) {
    return n % 10 == 1 && n % 100 != 11
      ? 1
      : [2, 3, 4].indexOf(n % 10) >= 0 && [12, 13, 14].indexOf(n % 100) < 0
        ? 3
        : n % 10 == 0 ||
          [5, 6, 7, 8, 9].indexOf(n % 10) >= 0 ||
          [11, 12, 13, 14].indexOf(n % 100) >= 0
          ? 4
          : 5
  },
  czech: function(n) {
    if (n === 1) {
      return 1
    }
    return n >= 2 && n <= 4 ? 3 : 5
  },
  polish: function(n) {
    if (n === 1) {
      return 1
    }
    return n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 3 : 5
  },
  icelandic: function(n) {
    return n % 10 !== 1 || n % 100 === 11 ? 5 : 1
  },
  slovenian: function(n) {
    return n % 100 == 1
      ? 1
      : n % 100 == 2
        ? 2
        : n % 100 == 3 || n % 100 == 4
          ? 3
          : 5
  },
}

// Mapping from pluralization group to individual locales.
const pluralTypeToLanguages = {
  arabic: ['ar'],
  chinese: ['id', 'ja', 'ko', 'lo', 'ms', 'th', 'zh'],
  german: [
    'fa',
    'da',
    'de',
    'en',
    'es',
    'fi',
    'el',
    'he',
    'hu',
    'it',
    'nl',
    'no',
    'pt',
    'sv',
  ],
  french: ['fr', 'tl', 'tr', 'pt-br'],
  russian: ['hr', 'ru', 'lt'],
  czech: ['cs', 'sk'],
  polish: ['pl'],
  icelandic: ['is'],
  slovenian: ['sl'],
}

function langToTypeMap(mapping) {
  var ret = {}
  forEach(mapping, function(langs, type) {
    forEach(langs, function(lang) {
      ret[lang] = type
    })
  })
  return ret
}

function pluralTypeName(locale) {
  var langToPluralType = langToTypeMap(pluralTypeToLanguages)
  return (
    langToPluralType[locale] ||
    langToPluralType[split.call(locale, /-/, 1)[0]] ||
    langToPluralType.en
  )
}

function pluralTypeIndex(locale, count) {
  return pluralTypes[pluralTypeName(locale)](count)
}

/**
 *
 * @param {any} phrase The phrase to be pluralised.
 * @param {object} params Additional parameters, mainly the plural options.
 * @param {string} locale The locale.
 *
 * @returns {string} The pluralised phrase.
 */
export default function pluralise(phrase, key, params, locale) {
  // Can only pluralise objects.
  if (typeof phrase !== 'object') {
    return phrase
  }

  if (!params.hasOwnProperty('count')) {
    return phrase
  }

  const pluralIndex = pluralOptions[pluralTypeIndex(locale, params.count)]
  const result = phrase[pluralIndex]

  if (!result) {
    console.warn(
      `Cannot find correct pluralization option "${pluralIndex}" for "${key}" for count "${
        params.count
      }" in locale "${locale}". Falling back to "other" if present.`
    )

    if (phrase.hasOwnProperty('other')) {
      return phrase.other
    }

    return phrase
  }

  return result
}
