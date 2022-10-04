import { test } from '@playwright/test';
import { runAnalysisTests } from './run-analysis.spec';
import { saveProjectTests } from './save-project.spec';
import { startServerTests } from './start-server.spec';
import { stopServerTests } from './stop-server.spec';
import { appHooksSetup, describeProjects, Hook, PROJECT_SETUP_DETAILS } from '../shared.spec';
import { PROJECTS } from '../../constants';

test.describe.configure({ mode: 'serial' });
appHooksSetup(Hook.all);

describeProjects(
  CURRENT_PROJECT => {
    startServerTests();
    runAnalysisTests(CURRENT_PROJECT);
    if (!process.env.CI) {
      stopServerTests();
    }
    saveProjectTests();
  },
  { [PROJECTS.OFFICE_HVAC]: PROJECT_SETUP_DETAILS[PROJECTS.OFFICE_HVAC] },
  Hook.all
);
