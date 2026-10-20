import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'tests/browser',fullyParallel:true,use:{baseURL:'http://127.0.0.1:4175/EduHub/',browserName:'chromium'},webServer:{command:'PORT=4175 node scripts/serve.mjs',url:'http://127.0.0.1:4175/EduHub/',reuseExistingServer:false},reporter:'list'});
