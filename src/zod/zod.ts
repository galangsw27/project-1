import i18next from 'i18next'
import jaTranslation from 'zod-i18n-map/locales/ja/zod.json'
import enTranslation from 'zod-i18n-map/locales/en/zod.json'
import idTranslation from 'zod-i18n-map/locales/id/zod.json'

import { makeZodI18nMap } from 'zod-i18n-map'
import { z } from 'zod'
import { getLocale } from '@/locales/dictionary'

const ja = i18next.createInstance()
ja.init({
  lng: 'ja',
  resources: {
    ja: { zod: jaTranslation },
  },
})

const id = i18next.createInstance()
id.init({
  lng: 'id',
  resources: {
    id: { zod: idTranslation },
  },
})


const en = i18next.createInstance()
en.init({
  lng: 'en',
  resources: {
    en: { zod: enTranslation },
  },
})

const zodMap = {
  en: makeZodI18nMap({ t: en.t }),
  ja: makeZodI18nMap({ t: ja.t }),  
  id: makeZodI18nMap({ t: id.t }),

}

// Set zod error map by user's locale.
// The error message should be translated based on user's locale.
z.setErrorMap((err, ctx) => zodMap[getLocale()](err, ctx))

export { z }
