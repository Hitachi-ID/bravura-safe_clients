import { Component } from "@angular/core";

import { BrowserApi } from "../../platform/browser/browser-api";

@Component({
  selector: "app-help-and-feedback",
  templateUrl: "help-and-feedback.component.html",
})
export class HelpAndFeedbackComponent {
  launchHelp() {
    BrowserApi.createNewTab("https://bravurasecuritydocs.com/safe/#/index/10/11");
  }

  launchForums() {
    BrowserApi.createNewTab("https://www.youtube.com/@BravuraSecurity/community");
  }

  launchContactForm() {
    BrowserApi.createNewTab("https://www.bravurasecurity.com/contact");
  }
}
