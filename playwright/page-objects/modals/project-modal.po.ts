import { App } from '../../App';
import { IPC_MAIN_HANDLE_MOCKS, ShowMessageBoxMock, ShowOpenDialogMock } from '../../mocks';
import { ModalPageObject } from './modal.po';

export class ProjectModalPageObject extends ModalPageObject {
  readonly EXPECTED_TITLE: string;
  readonly EXPECTED_FOOTER_BUTTONS: Record<string, string>;
  readonly OPEN_BUTTON_TEXT: string;

  async open(showOpenDialogMock?: ShowOpenDialogMock, showMessageBoxMock?: ShowMessageBoxMock) {
    if (showOpenDialogMock !== undefined) {
      await App.mockIpcMainHandle(IPC_MAIN_HANDLE_MOCKS.showOpenDialogChannel, showOpenDialogMock);
    }
    if (showMessageBoxMock !== undefined) {
      await App.mockIpcMainHandle(IPC_MAIN_HANDLE_MOCKS.showMessageBoxChannel, showMessageBoxMock);
    }

    await this.clickButton(this.OPEN_BUTTON_TEXT);
  }
}