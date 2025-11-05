## Error:

```bash
AtulyaRaaj@fedora:~/Desktop/Work/GlobalBiz-Project/vendor$ npx drizzle-dbml-cli src/drizzle/schema.ts -o schema.dbml
node:internal/modules/esm/loader:352
      throw new ERR_REQUIRE_ESM(url, true);
            ^

Error [ERR_REQUIRE_ESM]: require() of ES Module file:///home/AtulyaRaaj/Desktop/Work/GlobalBiz-Project/vendor/node_modules/.pnpm/drizzle-orm@0.33.0_@neondatabase+serverless@0.9.5_@types+pg@8.11.6_@types+react@18.3.18_react@18.3.1/node_modules/drizzle-orm/index.js not supported.
    at Object.transformer [as .js] (file:///home/AtulyaRaaj/.npm/_npx/706389d3ca969a57/node_modules/tsx/dist/register-C3TE0KFF.mjs:2:748)
    at TracingChannel.traceSync (node:diagnostics_channel:315:14) {
  code: 'ERR_REQUIRE_ESM'
}

Node.js v22.11.0
```

## Solution: 

Use the installed Node.js version: Now, you can use the nvm use command to switch to the installed version.

Using NVM I changed the node version:

```bash
nvm install --lts
nvm install 20
nvm use 20
```

## Error 2: 

After lowering down the nv I got : 

```
Detecting database type failed
```


## Solution:

```bash
npx drizzle-dbml-cli src/drizzle/schema.ts -o schema.dbml --type pg
```


