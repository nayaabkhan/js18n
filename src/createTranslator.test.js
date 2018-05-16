require('./intl')

import createTranslator from './createTranslator'

import enGlossary from '../fixtures/en/glossary'
import enMessages from '../fixtures/en/messages'
import enRoutes from '../fixtures/en/routes'

import jpGlossary from '../fixtures/jp/glossary'
import jpMessages from '../fixtures/jp/messages'

import ruGlossary from '../fixtures/ru/glossary'
import ruMessages from '../fixtures/ru/messages'

describe('createTranslator', () => {
  const enIN = createTranslator('en-IN', {
    glossary: enGlossary,
    messages: enMessages,
  })

  const jaJP = createTranslator('ja-JP', {
    glossary: jpGlossary,
    messages: jpMessages,
  })

  const ru = createTranslator('ru', {
    glossary: ruGlossary,
    messages: ruMessages,
  })

  it('should return an instance', () => {
    expect(enIN).toBeDefined()
    expect(jaJP).toBeDefined()
  })

  describe('getLocale()', () => {
    it('should be possible to get locale', () => {
      expect(enIN.getLocale()).toEqual('en-IN')
      expect(jaJP.getLocale()).toEqual('ja-JP')
    })
  })

  describe('getResources()', () => {
    it('should be possible to get resources', () => {
      const enResources = enIN.getResources()

      expect(enResources.glossary.brand.name).toBeDefined()
      expect(enResources.glossary.brand.tagline).toBeDefined()
      expect(enResources.messages.welcome).toBeDefined()
      expect(enResources.messages.title.male).toBeDefined()
    })
  })

  describe('translate()', () => {
    it('should return the key itself if translation is missing', () => {
      expect(enIN.translate('messages.notfound')).toEqual('messages.notfound')
      expect(jaJP.translate('messages.notfound')).toEqual('messages.notfound')
    })

    it('should return the fallback option', () => {
      expect(enIN.translate('messages.notfound', { default: '404' })).toEqual(
        '404'
      )
    })

    it('should translate simple keys', () => {
      expect(enIN.translate('messages.hello')).toEqual('Hello')
      expect(enIN.translate('glossary.brand.name')).toEqual('Acme')
      expect(enIN.translate('glossary.brand.tagline')).toEqual('Just do it!')

      expect(jaJP.translate('messages.hello')).toEqual('こんにちは')
      expect(jaJP.translate('glossary.brand.name')).toEqual('Acme')
      expect(jaJP.translate('glossary.brand.tagline')).toEqual('早くやれよ！')

      expect(ru.translate('messages.hello')).toEqual('Здравствуйте')
      expect(ru.translate('glossary.brand.name')).toEqual('Acme')
      expect(ru.translate('glossary.brand.tagline')).toEqual(
        'Просто сделай это!'
      )
    })

    describe('interpolation', () => {
      it('should do nothing if no match found', () => {
        expect(enIN.translate('messages.welcome')).toEqual('Welcome {{user}}!')
        expect(jaJP.translate('messages.welcome')).toEqual('ようこそ {{user}}!')
        expect(ru.translate('messages.welcome')).toEqual(
          'Добро пожаловать {{user}}!'
        )
      })

      it('should interpolate if match found', () => {
        expect(enIN.translate('messages.welcome', { user: 'Khan' })).toEqual(
          'Welcome Khan!'
        )
        expect(jaJP.translate('messages.welcome', { user: 'Khan' })).toEqual(
          'ようこそ Khan!'
        )
        expect(ru.translate('messages.welcome', { user: 'Khan' })).toEqual(
          'Добро пожаловать Khan!'
        )
      })

      it('should interpolate multiple occurences', () => {
        expect(enIN.translate('messages.taken', { username: 'Khan' })).toEqual(
          'Failed to save as Khan. Khan is already taken.'
        )

        expect(
          enIN.translate('messages.achievement', {
            user: 'Dragonlord',
            team: 'Global offensive',
          })
        ).toEqual('Dragonlord of team Global offensive drew first blood!')

        expect(jaJP.translate('messages.taken', { username: 'Khan' })).toEqual(
          'Khanとして保存できませんでした。 Khanは既に行われています。'
        )

        expect(
          jaJP.translate('messages.achievement', {
            user: 'Dragonlord',
            team: 'Global offensive',
          })
        ).toEqual('チームGlobal offensiveのDragonlordが最初の血を出しました！')

        expect(ru.translate('messages.taken', { username: 'Khan' })).toEqual(
          'Не удалось сохранить как Khan. Khan уже выполнено.'
        )

        expect(
          ru.translate('messages.achievement', {
            user: 'Dragonlord',
            team: 'Global offensive',
          })
        ).toEqual('Dragonlord команды Global offensive набрал первую кровь!')
      })
    })

    describe('context', () => {
      it('should match context', () => {
        expect(
          enIN.translate('messages.title', { user: 'John', context: 'male' })
        ).toEqual('John is an expert masseur')

        expect(
          enIN.translate('messages.title', { user: 'Jenna', context: 'female' })
        ).toBe('Jenna is an expert masseuse')

        expect(
          jaJP.translate('messages.title', { user: 'John', context: 'male' })
        ).toEqual('Johnは専門のマッサージ師です')

        expect(
          jaJP.translate('messages.title', { user: 'Jenna', context: 'female' })
        ).toBe('Jennaは専門のマッサージ器です')

        expect(
          ru.translate('messages.title', { user: 'John', context: 'male' })
        ).toEqual('John - эксперт-массажист')

        expect(
          ru.translate('messages.title', { user: 'Jenna', context: 'female' })
        ).toBe('Jenna - экспертная массажистка')
      })

      it('should fallback on default context', () => {
        expect(enIN.translate('messages.title', { user: 'Chandler' })).toBe(
          'Chandler is an expert masseuse'
        )

        expect(jaJP.translate('messages.title', { user: 'Chandler' })).toBe(
          'Chandlerは専門のマッサージ師です'
        )

        expect(ru.translate('messages.title', { user: 'Chandler' })).toBe(
          'Chandler - эксперт-массажист'
        )
      })
    })

    describe('pluralisation', () => {
      it('should pluralise', () => {
        expect(enIN.translate('messages.unread', { count: 0 })).toBe(
          'All caught up!'
        )
        expect(enIN.translate('messages.unread', { count: 1 })).toBe(
          'You have an unread message'
        )
        expect(enIN.translate('messages.unread', { count: 5 })).toBe(
          'You have 5 unread messages'
        )

        expect(jaJP.translate('messages.unread', { count: 0 })).toBe(
          '未読メッセージが0あります'
        )
        expect(jaJP.translate('messages.unread', { count: 1 })).toBe(
          '未読メッセージが1あります'
        )
        expect(jaJP.translate('messages.unread', { count: 5 })).toBe(
          '未読メッセージが5あります'
        )

        expect(ru.translate('messages.unread', { count: 1 })).toBe(
          'У вас есть 1 непрочитанное сообщение'
        )
        expect(ru.translate('messages.unread', { count: 2 })).toBe(
          'У вас есть 2 непрочитанных сообщения'
        )
        expect(ru.translate('messages.unread', { count: 5 })).toBe(
          'У вас есть 5 непрочитанных сообщений'
        )
        expect(ru.translate('messages.unread', { count: 3.5 })).toBe(
          'У вас есть 3.5 непрочитанные сообщения'
        )
      })
    })

    describe('context and pluralisation', () => {
      it('should match context and pluralise', () => {
        expect(
          enIN.translate('messages.friends', {
            user: 'John',
            count: 0,
            context: 'male',
          })
        ).toBe('John has 0 boyfriends')
        expect(
          enIN.translate('messages.friends', {
            user: 'John',
            count: 1,
            context: 'female',
          })
        ).toBe('John has one girlfriend')
        expect(
          enIN.translate('messages.friends', { user: 'John', count: 5 })
        ).toBe('John has 5 friends')

        expect(
          jaJP.translate('messages.friends', {
            user: 'John',
            count: 0,
            context: 'male',
          })
        ).toBe('Johnはボーイフレンドを0持っています')
        expect(
          jaJP.translate('messages.friends', {
            user: 'John',
            count: 1,
            context: 'female',
          })
        ).toBe('Johnはガールフレンドを1持っています')
        expect(
          jaJP.translate('messages.friends', { user: 'John', count: 5 })
        ).toBe('Johnは5の友達を持っています')

        expect(
          ru.translate('messages.friends', {
            user: 'John',
            count: 0,
            context: 'male',
          })
        ).toBe('John имеет 0 парней')
        expect(
          ru.translate('messages.friends', {
            user: 'John',
            count: 1,
            context: 'female',
          })
        ).toBe('John имеет 1 подругу')
        expect(
          ru.translate('messages.friends', { user: 'John', count: 5 })
        ).toBe('John имеет 5 друзей')
      })
    })
  })

  describe('addResources()', () => {
    enIN.addResources({ routes: enRoutes })

    it('should have new "routes" catalog', () => {
      expect(enIN.translate('routes.event', 'event/:id?'))
    })
  })

  describe('localise()', () => {
    const number = 12345678
    const whole = 1234.5678
    const percent = 55 / 100
    const currency = 23400

    describe('numbers', () => {
      it('should format integers', () => {
        expect(enIN.localise(number)).toBe('1,23,45,678')
        expect(jaJP.localise(number)).toBe('12,345,678')
        expect(ru.localise(number)).toBe('12 345 678')
      })

      it('should format whole numbers', () => {
        expect(enIN.localise(whole)).toBe('1,234.568')
        expect(jaJP.localise(whole)).toBe('1,234.568')
        expect(ru.localise(whole)).toBe('1 234,568')
      })

      it('should format percentages', () => {
        expect(enIN.localise(percent, { style: 'percent' })).toBe('55%')
        expect(jaJP.localise(percent, { style: 'percent' })).toBe('55%')
        expect(ru.localise(percent, { style: 'percent' })).toBe('55 %')
      })

      it('should format currencies', () => {
        expect(
          enIN.localise(currency, { style: 'currency', currency: 'INR' })
        ).toBe('₹ 23,400.00')

        expect(
          enIN.localise(currency, { style: 'currency', currency: 'USD' })
        ).toBe('US$ 23,400.00')

        expect(
          enIN.localise(currency, { style: 'currency', currency: 'EUR' })
        ).toBe('€ 23,400.00')

        expect(
          jaJP.localise(currency, { style: 'currency', currency: 'JPY' })
        ).toBe('￥23,400')

        expect(
          jaJP.localise(currency, { style: 'currency', currency: 'USD' })
        ).toBe('$23,400.00')

        expect(
          jaJP.localise(currency, { style: 'currency', currency: 'EUR' })
        ).toBe('€23,400.00')

        expect(
          ru.localise(currency, { style: 'currency', currency: 'JPY' })
        ).toBe('23 400 ¥')

        expect(
          ru.localise(currency, { style: 'currency', currency: 'USD' })
        ).toBe('23 400,00 $')

        expect(
          ru.localise(currency, { style: 'currency', currency: 'EUR' })
        ).toBe('23 400,00 €')
      })
    })

    describe('dates', () => {
      var maythe4th = new Date(Date.UTC(2012, 4, 4, 0, 0, 0))

      it('should format dates', () => {
        expect(enIN.localise(maythe4th)).toBe('4/5/2012')
        expect(jaJP.localise(maythe4th)).toBe('2012/5/4')
        expect(ru.localise(maythe4th)).toBe('04.05.2012')
      })

      it('should format long dates', () => {
        expect(
          enIN.localise(maythe4th, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        ).toBe('Friday 4 May 2012')

        expect(
          jaJP.localise(maythe4th, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        ).toBe('2012年5月4日金曜日')

        expect(
          ru.localise(maythe4th, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        ).toBe('пятница, 4 мая 2012 г.')
      })
    })
  })
})
