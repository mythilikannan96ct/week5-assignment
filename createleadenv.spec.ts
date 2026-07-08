import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';
import leadData from './data/leadData2.json'

dotenv.config({ path: path.resolve(__dirname+'/data', `${process.env.envFile || 'qa2'}.env`) });

test.describe.serial('Create Lead - Data Parameterized', () => {

  for (const data of leadData) {
    test(`Create lead for ${data.companyName}`, async ({ page }) => {

      await page.goto(process.env.QA_URL  as string);
      await page.locator('#username').fill(process.env.QA_USERNAME  as string);
      await page.locator('#password').fill(process.env.QA_PASSWORD  as string);
      await page.locator('.decorativeSubmit').click();

      await page.locator('a', { hasText: 'CRM/SFA' }).click();
      await page.locator('a', { hasText: 'Leads' }).click();
      await page.locator('a', { hasText: 'Create Lead' }).click();

      // Mandatory fields
      await page.locator('#createLeadForm_companyName').fill(data.companyName);
      await page.locator('#createLeadForm_firstName').fill(data.firstName);
      await page.locator('#createLeadForm_lastName').fill(data.lastName);

      // Source - by label
      await page.locator('#createLeadForm_dataSourceId').selectOption({ label: data.source });

      // Marketing Campaign - by value
      await page.locator('#createLeadForm_marketingCampaignId').selectOption({ value: data.campaignValue });

      // Get count + print all Marketing Campaign values
      const campaignOptions = page.locator('#createLeadForm_marketingCampaignId option');
      const campaignCount = await campaignOptions.count();
      console.log(`Marketing Campaign options count: ${campaignCount}`);
      const campaignValues = await campaignOptions.allTextContents();
      console.log(campaignValues);

      // Industry - by index
      await page.locator('#createLeadForm_industryEnumId').selectOption({ index: data.industryIndex });

      // Currency
      await page.locator('#createLeadForm_currencyUomId').selectOption(data.currency);

      // Country - triggers AJAX load for State
      await page.locator('#createLeadForm_generalCountryGeoId').selectOption({ label: data.country });

      // Wait for State dropdown to populate (dynamic AJAX - your recurring issue)
      const stateDropdown = page.locator('#createLeadForm_generalStateProvinceGeoId');
      await expect(stateDropdown.locator('option').nth(1)).toBeAttached();

      // Get count + print all State values
      const stateOptions = stateDropdown.locator('option');
      const stateCount = await stateOptions.count();
      console.log(`State options count: ${stateCount}`);
      const stateValues = await stateOptions.allTextContents();
      console.log(stateValues);

      // Select any state - say index 5
      await stateDropdown.selectOption({ index: 5 });

      await page.locator('input[name="submitButton"]').click();
    });
  }
});