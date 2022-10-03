import { expect } from '@playwright/test';
import { PAGES } from '../../constants';
import { PagePO } from './page.po';

export class AnalysisPO extends PagePO {
  static readonly EXPECTED_PAGE = PAGES.ANALYSIS;
  static EXPECTED_TITLE: string;

  static async isTitleOk() {
    expect(await this.getTitle()).toHaveText(this.EXPECTED_TITLE ?? this.EXPECTED_PAGE);
  }
}