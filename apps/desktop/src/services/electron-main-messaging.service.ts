import { app, dialog, ipcMain, Menu, MenuItem, nativeTheme, session } from "electron";

import { MessagingService } from "@bitwarden/common/abstractions/messaging.service";
import { ThemeType } from "@bitwarden/common/enums/themeType";

import { WindowMain } from "../main/window.main";
import { RendererMenuItem } from "../utils";

export class ElectronMainMessagingService implements MessagingService {
  constructor(private windowMain: WindowMain, private onMessage: (message: any) => void) {
    ipcMain.handle("appVersion", () => {
      return app.getVersion();
    });

    ipcMain.handle("systemTheme", () => {
      return nativeTheme.shouldUseDarkColors ? ThemeType.Dark : ThemeType.Light;
    });

    ipcMain.handle("showMessageBox", (event, options) => {
      return dialog.showMessageBox(this.windowMain.win, options);
    });

    ipcMain.handle("openContextMenu", (event, options: { menu: RendererMenuItem[] }) => {
      return new Promise((resolve) => {
        const menu = new Menu();
        options.menu.forEach((m, index) => {
          menu.append(
            new MenuItem({
              label: m.label,
              type: m.type,
              click: () => {
                resolve(index);
              },
            })
          );
        });
        menu.popup({
          window: windowMain.win,
          callback: () => {
            resolve(-1);
          },
        });
      });
    });

    ipcMain.handle("windowVisible", () => {
      return windowMain.win?.isVisible();
    });

    ipcMain.handle("getCookie", async (event, options) => {
      return await session.defaultSession.cookies.get(options);
    });

    nativeTheme.on("updated", () => {
      windowMain.win?.webContents.send(
        "systemThemeUpdated",
        nativeTheme.shouldUseDarkColors ? ThemeType.Dark : ThemeType.Light
      );
    });
  }

  send(subscriber: string, arg: any = {}) {
    const message = Object.assign({}, { command: subscriber }, arg);
    this.onMessage(message);
    if (this.windowMain.win != null) {
      this.windowMain.win.webContents.send("messagingService", message);
    }
  }
}
