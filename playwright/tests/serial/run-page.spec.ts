import { expect, test } from '@playwright/test';
import { EXPECTED_DETAILS_BY_PAGE, Page, Projects } from '../../constants';
import { DeleteResultsModalPO, NavPO, RunPO } from '../../page-objects';
import { testRunPage } from '../shared.spec';

const EXTENDED_EXPECT_TIMEOUT = {
  timeout: 5 * 60_000 // 5 minutes
};

export const runPageTests = (CURRENT_PROJECT: Projects) =>
  test.describe('"Run" page', () => {
    test.beforeAll(async () => await NavPO.clickIcon(EXPECTED_DETAILS_BY_PAGE[Page.RUN].iconAlt));

    testRunPage(true, CURRENT_PROJECT);

    test('progress bar is 0%', async () => {
      expect(await RunPO.getProgressBarPercent()).toBe(0);
    });

    test.describe('click "Run Entire Workflow" button', () => {
      test.beforeAll(async () => await RunPO.clickButton(RunPO.EXPECTED_BUTTONS.RUN_ENTIRE_WORKFLOW));

      test.describe('"Delete Local Results?" modal', () => {
        test('is shown', async () => {
          await DeleteResultsModalPO.isOk();
        });

        test.describe('click "OK" button', () => {
          test.beforeAll(
            async () => await DeleteResultsModalPO.clickButton(DeleteResultsModalPO.EXPECTED_FOOTER_BUTTONS.OK)
          );

          test('run is queued', async () => {
            await expect(RunPO.progressBar).toHaveText(
              RunPO.EXPECTED_PROGRESS_BAR_TEXT.ANALYSIS_STARTED,
              EXTENDED_EXPECT_TIMEOUT
            );
            const percent = await RunPO.getProgressBarPercent();
            expect(percent).toBeGreaterThan(0);
            expect(percent).toBeLessThan(100);
            expect(RunPO.runStatus).toContainText('queued');
          });

          test('run starts', async () => {
            expect(RunPO.runStatus).toContainText('started', EXTENDED_EXPECT_TIMEOUT);
            expect((await RunPO.getRunID()).length).toBeGreaterThan(0);
          });

          test('run completes', async () => {
            await expect(RunPO.progressBar).toHaveText(
              RunPO.EXPECTED_PROGRESS_BAR_TEXT.ANALYSIS_COMPLETED,
              EXTENDED_EXPECT_TIMEOUT
            );
            expect(await RunPO.getProgressBarPercent()).toBe(100);
            await expect(RunPO.runStatus).toContainText('completed');
          });
        });
      });
    });
  });
