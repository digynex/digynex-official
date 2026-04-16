import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import de from './locales/de.json'
import sw from './locales/sw.json'
import fr from './locales/fr.json'
import es from './locales/es.json'
import it from './locales/it.json'
import pt from './locales/pt.json'
import nl from './locales/nl.json'
import da from './locales/da.json'
import fi from './locales/fi.json'
import tr from './locales/tr.json'
import ru from './locales/ru.json'
import ar from './locales/ar.json'
import jp from './locales/jp.json'
import cn from './locales/cn.json'
import kr from './locales/kr.json'

const i18n = createI18n({
  legacy: false,
  locale: 'EN',
  fallbackLocale: 'EN',
  messages: {
    EN: en,
    DE: de,
    SW: sw,
    FR: fr,
    ES: es,
    IT: it,
    PT: pt,
    NL: nl,
    DA: da,
    FI: fi,
    TR: tr,
    RU: ru,
    AR: ar,
    JP: jp,
    CN: cn,
    KR: kr
  }
})

export default i18n
