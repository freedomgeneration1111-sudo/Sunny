import {defineConfig} from "vitest/config";

export default defineConfig({test:{include:["operations/test/**/*.test.ts"],environment:"node"}});
