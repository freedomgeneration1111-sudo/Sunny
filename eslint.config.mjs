import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Next.js generates next-env.d.ts and may rewrite it during dev/build.
    // Wrangler generates operations/worker-configuration.d.ts from the checked-in Worker config.
    // Keep the framework-generated declaration out of application linting,
    // matching Next.js' documented flat-config defaults.
    ignores: [".next/**", "out/**", "node_modules/**", "next-env.d.ts", "operations/worker-configuration.d.ts", "operations/staff-app/dist/**"],
  },
];

eslintConfig.push({ files: ["operations/staff-app/**/*.{ts,tsx}"], rules: { "@next/next/no-img-element": "off" } });
export default eslintConfig;
