import { Component, OnInit } from "@angular/core";

import { PopupUtilsService } from "../services/popup-utils.service";

@Component({
  selector: "app-private-mode-warning",
  templateUrl: "private-mode-warning.component.html",
})
export class PrivateModeWarningComponent implements OnInit {
  showWarning = false;

  constructor(private popupUtilsService: PopupUtilsService) {}

  ngOnInit() {
    const isChrome = navigator.userAgent.match(/chrome|chromium|crios/i);
    // don't show the private mode warning for chrome
    if (!isChrome)
      this.showWarning = this.popupUtilsService.inPrivateMode();
  }
}
