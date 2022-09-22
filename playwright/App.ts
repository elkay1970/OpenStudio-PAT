import { ElectronApplication, Page, _electron as electron } from '@playwright/test';
import { MAIN_SCRIPT_PATH } from './paths';

export class App {
  static instance: ElectronApplication;
  static page: Page;

  static get isClosed() {
    return !App.instance?.windows().length;
  }

  static async close() {
    try {
      if (!App.isClosed) {
        await App.instance.close();
      }
    } catch {}
  }

  static async launchNewInstance() {
    await App.close();

    App.instance = await electron.launch({
      args: [MAIN_SCRIPT_PATH]
    });
    App.instance.on('window', async page => {
      const filename = page.url()?.split('/').pop();
      console.log(`Window opened: ${filename}`);

      // capture errors
      page.on('pageerror', error => {
        console.error(error);
      });
      // capture console messages
      page.on('console', msg => {
        console.log(msg.text());
      });
    });

    App.page = await App.instance.firstWindow();
  }

  static async launchIfClosed() {
    if (App.isClosed) {
      await App.launchNewInstance();
    }
  }

  static async mockIpcMainHandle(channel: string, returnValue: any) {
    await App.instance.evaluate(({ ipcMain }, params) => ipcMain.handle(params.channel, () => params.returnValue), {
      channel,
      returnValue
    });
  }

  static async removeAllIpcMainListeners(channel?: string) {
    try {
      await App.instance?.evaluate(({ ipcMain }, params) => ipcMain.removeAllListeners(params.channel), {
        channel
      });
    } catch {}
  }
}