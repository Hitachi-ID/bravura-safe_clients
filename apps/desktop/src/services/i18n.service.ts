import * as fs from "fs";
import * as path from "path";

import { I18nService as BaseI18nService } from "@bitwarden/common/services/i18n.service";

export class I18nService extends BaseI18nService {
  constructor(systemLanguage: string, localesDirectory: string) {
    super(systemLanguage, localesDirectory, (formattedLocale: string) => {
      const filePath = path.join(
        __dirname,
        this.localesDirectory + "/" + formattedLocale + "/messages.json"
      );
      const localesJson = fs.readFileSync(filePath, "utf8");
      const locales = JSON.parse(localesJson.replace(/^\uFEFF/, "")); // strip the BOM
      return Promise.resolve(locales);
    });

    // Please leave 'en' where it is, as it's our fallback language in case no translation can be found
    this.supportedTranslationLocales = [
      "en",
      "de",
      "en-GB",
      "es",
      "fr",
      "ja",
      "pt-BR",
      "zh-CN",
    ];
  }
}
