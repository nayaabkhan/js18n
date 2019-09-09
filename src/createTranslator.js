import interpolate from './middlewares/interpolate'
import context from './middlewares/context'
import pluralise from './middlewares/pluralise'

/**
 * Creates a new translator that holds all resources and provides way to
 * translate them.
 *
 * @param {string} locale The current locale. This locale will be used for
 * pluralisation, date formatting and so on.
 *
 * @param {object} [preloadedResources] The resources to be loades initially.
 * These could be initialsed from the server or local storage.
 *
 * @param {...function} middlewares The middleware chain to be applied.
 *
 * @returns {Translator} An object that lets you translate resources,
 * add resources, and get all resources.
 */
export default function createTranslator(
  locale,
  preloadedResources = {},
  middlewares = []
) {
  if (typeof locale !== 'string') {
    throw new Error('Expected the locale to be a string.')
  }

  if (typeof preloadedResources !== 'object') {
    throw new Error('Expected the preloaded resources to be an object.')
  }

  // Order does matter.
  let currentMiddlewares = [context, pluralise, interpolate].concat(middlewares)

  let currentResources = {}
  addResources(preloadedResources)

  /**
   * Gets the locale using which it was initialised.
   *
   * @returns {string} The current locale.
   */
  function getLocale() {
    return locale
  }

  /**
   * Gets all the resources.
   *
   * @returns {object} The current resources.
   */
  function getResources() {
    return currentResources
  }

  /**
   * Adds new resources.
   *
   * @param {object} resources New resources to add.
   */
  function addResources(resources) {
    if (typeof resources !== 'object') {
      throw new Error('Expected the resources to be an object.')
    }

    currentResources = Object.assign({}, currentResources, resources)
  }

  /**
   *
   * @param {string} key Key to translate.
   * @param {params} params Additional parameters.
   *
   * @returns {string} Tranlation for the given key.
   */
  function translate(key, params = {}) {
    const match = findPhrase(key, currentResources)

    const phrase = currentMiddlewares.reduce((acc, middleware) => {
      return middleware(acc, key, params, locale)
    }, match)

    if (typeof phrase === 'string') {
      return phrase
    } else if (typeof params.default === 'string') {
      return interpolate(params.default, params)
    } else {
      console.warn(`Missing translation for key: "${key}", locale: "${locale}"`)
      return key
    }
  }

  /**
   * Find the match using key.
   *
   * @param {string} key The key to find.
   * @param {object} resources Resouces.
   *
   * @returns {any} Match of the key from resources.
   */
  function findPhrase(key, resources) {
    const keyParts = key.split('.')

    return keyParts.reduce((submatch, part) => {
      return submatch && submatch[part]
    }, resources)
  }

  function localise(value, options) {
    if (typeof value === 'number') {
      return new Intl.NumberFormat(locale, options).format(value)
    }

    if (value instanceof Date) {
      return new Intl.DateTimeFormat(locale, options).format(value)
    }
  }

  return {
    getLocale,
    getResources,
    addResources,
    translate,
    t: translate,
    localise,
    l: localise,
  }
}
