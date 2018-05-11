import createTranslator from './createTranslator'
import language from './language/en'

import glossary from '../fixtures/en/glossary'
import messages from '../fixtures/en/messages'
import routes from '../fixtures/en/routes'

describe('createTranslator', () => {
  const i18n = createTranslator('en', { glossary, messages }, language)

  it('should return an instance', () => {
    expect(i18n).toHaveProperty('getLocale')
    expect(i18n).toHaveProperty('translate')
  })

  it('should be possible to get locale', () => {
    expect(i18n.getLocale()).toEqual('en')
  })

  describe('translate()', () => {
    it('should return the key itself if translation is missing', () => {
      expect(i18n.translate('messages.notfound')).toEqual('messages.notfound')
    })

    it('should return the fallback option', () => {
      expect(i18n.translate('messages.notfound', { _: '404' })).toEqual('404')
    })

    it('should translate simple keys', () => {
      expect(i18n.translate('messages.hello')).toEqual('Hello')
      expect(i18n.translate('glossary.brand.name')).toEqual('Meetup')
      expect(i18n.translate('glossary.brand.tagline')).toEqual(
        'Meet interesting people'
      )
    })

    describe('interpolation', () => {
      it('should do nothing if no match found', () => {
        expect(i18n.translate('messages.welcome')).toEqual('Welcome {{user}}!')
      })

      it('should interpolate if match found', () => {
        expect(i18n.translate('messages.welcome', { user: 'Khan' })).toEqual(
          'Welcome Khan!'
        )
      })

      it('should interpolate multiple occurences', () => {
        expect(i18n.translate('messages.taken', { username: 'Khan' })).toEqual(
          'Failed to save as Khan. Khan is already taken.'
        )

        expect(
          i18n.translate('messages.achievement', {
            user: 'Dragonlord',
            team: 'Global offensive',
          })
        ).toEqual('Dragonlord of team Global offensive drew first blood!')
      })
    })

    describe('context', () => {
      it('should match context', () => {
        expect(
          i18n.translate('messages.title', { user: 'John', context: 'male' })
        ).toEqual('John is an expert masseur')

        expect(
          i18n.translate('messages.title', { user: 'Jenna', context: 'female' })
        ).toBe('Jenna is an expert masseuse')
      })

      it('should fallback on default context', () => {
        expect(i18n.translate('messages.title', { user: 'Chandler' })).toBe(
          'Chandler is an expert masseuse'
        )
      })
    })

    describe('pluralisation', () => {
      it('should pluralise', () => {
        expect(i18n.translate('messages.unread', { count: 0 })).toBe(
          'All caught up!'
        )
        expect(i18n.translate('messages.unread', { count: 1 })).toBe(
          'You have an unread message'
        )
        expect(i18n.translate('messages.unread', { count: 5 })).toBe(
          'You have 5 unread messages'
        )
      })
    })

    describe('context and pluralisation', () => {
      it('should match context and pluralise', () => {
        expect(
          i18n.translate('messages.friends', {
            user: 'John',
            count: 0,
            context: 'male',
          })
        ).toBe('John has 0 boyfriends')
        expect(
          i18n.translate('messages.friends', {
            user: 'John',
            count: 1,
            context: 'female',
          })
        ).toBe('John has one girlfriend')
        expect(
          i18n.translate('messages.friends', { user: 'John', count: 5 })
        ).toBe('John has 5 friends')
      })
    })
  })

  describe('addResources()', () => {
    i18n.addResources({ routes })

    it('should have new "routes" catalog', () => {
      expect(i18n.translate('routes.event', 'event/:id?'))
    })
  })
})
