import { Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";

import { I18nService } from "@bitwarden/common/abstractions/i18n.service";
import { StateService } from "@bitwarden/common/abstractions/state.service";

@Injectable()
export class RouterService {
  private currentUrl: string = undefined;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private stateService: StateService,
    i18nService: I18nService
  ) {
    this.currentUrl = this.router.url;

    router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.url;

        let title = i18nService.t("pageTitle", "Bravura Safe");
        let child = this.activatedRoute.firstChild;
        while (child.firstChild) {
          child = child.firstChild;
        }

        const titleId: string = child?.snapshot?.data?.titleId;
        const rawTitle: string = child?.snapshot?.data?.title;
        const updateUrl = !child?.snapshot?.data?.doNotSaveUrl ?? true;

        if (titleId != null || rawTitle != null) {
          const newTitle = rawTitle != null ? rawTitle : i18nService.t(titleId);
          if (newTitle != null && newTitle !== "") {
            title = newTitle + " | " + title;
          }
        }
        this.titleService.setTitle(title);
        if (updateUrl) {
          this.setPreviousUrl(this.currentUrl);
        }
      });
  }

  async getPreviousUrl() {
    return await this.stateService.getPreviousUrl();
  }

  async setPreviousUrl(url: string) {
    await this.stateService.setPreviousUrl(url);
  }
}
