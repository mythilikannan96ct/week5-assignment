import { test, expect } from '@playwright/test';
import leadData from './data/createLeadData.json'

test.describe('Create Lead - Data Parameterization', () => {

  for (const lead of leadData) {  
    test(`Create Lead for ${lead.company}`, async ({ page }) => {

      await page.goto('http://leaftaps.com/opentaps/control/main');
      await page.locator('#username').fill( 'DemoSalesManager');
      await page.locator('#password').fill( 'crmsfa');
      await page.locator('.decorativeSubmit').click();
 
      await page.locator('a:has-text("CRM/SFA")').click();
      await page.locator('a:has-text("Leads")').click();
      await page.locator('a:has-text("Create Lead")').click();
      
      // mandatory fields - from JSON
      await page.locator('#createLeadForm_companyName').fill(lead.company);
      await page.locator('#createLeadForm_firstName').fill(lead.firstName);
      await page.locator('#createLeadForm_lastName').fill(lead.lastName);

      // Source dropdown - by label
      await page.locator('#createLeadForm_dataSourceId').selectOption({ label: 'Direct Mail' });

      // Marketing Campaign - by value
      await page.locator('#createLeadForm_marketingCampaignId').selectOption({ value: 'DEMO_MKTG_CAMP' });

      // count + print all Marketing Campaign options
      const campaignOptions = await page.locator('#createLeadForm_marketingCampaignId option').allTextContents();
      console.log('Marketing Campaign count:', campaignOptions.length);
      console.log('Marketing Campaign values:', campaignOptions);

      // Industry - by index
      await page.locator('#createLeadForm_industryEnumId').selectOption({ index: 3 });

      // Preferred Currency - INR
      await page.locator('#createLeadForm_currencyUomId').selectOption({ value: 'INR' });

      // Country - India
      await page.locator('#createLeadForm_generalCountryGeoId').selectOption({ label: 'India' });

      await page.waitForTimeout(1000);

      // count + print all State options
      const stateOptions = await page.locator('#createLeadForm_generalStateProvinceGeoId option').allTextContents();
      console.log('State count:', stateOptions.length);
      console.log('State values:', stateOptions);

      // select any state (say index 2)
      await page.locator('#createLeadForm_generalStateProvinceGeoId').selectOption({ index: 2 });

      await page.locator('.smallSubmit').click();
      //await page.screenshot({path:'after-submit.png',fullPage:true});
  
     // await expect(page.locator('.xh-highlight')).toBeVisible();
    });
  }
});