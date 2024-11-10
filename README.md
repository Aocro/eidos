![eidos](/public/show/table-and-doc.webp)

<div align="center">
    <a href="https://eidos.space?home=1">Home Page</a> |
    <a href="https://discord.gg/bsGMPDR23b">Discord</a> |
    <a href="https://eidos.space/download">Download</a>
    <p>
    Eidos is an extensible framework for managing your personal data throughout your lifetime in one place.
    </p>
</div>

> [!IMPORTANT]
> Eidos sets a big goal in mind, but it is still in its early stages, and there is a lot of work to be done. You can give it a try, but I do not recommend using it for production purposes. If you're interested in this project, I recommend staying updated on its development. If you have an Early Access key, you'll receive an email notification when Eidos is officially released.

## Features

- Everything runs inside your local machine.
- Offline Support: Access your data without an internet connection. Data is stored locally for blazing-fast performance.
- AI Features: Deeply integrated with LLM for AI-powered capabilities. Translate, summarize, and interact with your data within Eidos. AI works even offline.
- Extensible: Customize Eidos to suit your needs.

  - Prompt: Speed up your workflow with the Prompt extension. No coding required.
  - UDF: Use JavaScript to customize Formula functions.
  - Script: Create powerful data processing logic with TypeScript/JavaScript.
  - App: Build your own app using any preferred framework. (POC)
  - Block: Extend documents with custom blocks.(POC)
  - Field: Extend tables with custom fields.(Soon)

- Developer Friendly:

  - API & SDK
  - Sqlite Standardization: Every table in Eidos is a SQLite table.

## How to use

There are two versions of Eidos:

- Web app[tech preview]: Accessible via browser, it's a pure PWA with no web server. But it has some limitations, see [web-vs-desktop](./docs/web-vs-desktop.md)
- Desktop app[recommended]: Offline support, full features.

Get the app from: https://eidos.space/download

## How to develop

### web app

1. Clone the repository `git clone git@github.com:mayneyao/eidos.git`
2. Run `pnpm install` to install dependencies
3. Run `pnpm dev`
4. You can now access the app in your browser at http://localhost:5173

### desktop app

Download [libsimple](https://github.com/wangfenjin/simple) first, see more details at [workflows](./.github/workflows/build-and-release-desktop-app.yml)

1. Clone the repository `git clone git@github.com:mayneyao/eidos.git`
2. Run `pnpm install` to install dependencies
3. Run `pnpm dev:desktop`

## How to deploy your own

For most users, you don't need to deploy your own. You can use the desktop app version of Eidos with full offline support and features.

If you want to deploy your own, see more details at [self-hosting](./docs/self-hosting.md)

## Roadmap

https://github.com/users/mayneyao/projects/5

- [x] Desktop App
- [x] I18n
- [ ] Publish Service: Publish your data to the web.
- [ ] P2p sync based on CRDT: local-first, not local-only. Sync your data across devices.

## Credits

Eidos based on the following open-source projects:

### web app

- [sqlite-wasm](https://github.com/sqlite/sqlite-wasm) - Run SQLite in the browser
- [shadcn-ui](https://github.com/shadcn-ui/ui) - UI components
- [glide-data-grid](https://github.com/glideapps/glide-data-grid) - High performance table
- [lexical](https://github.com/facebook/lexical) - Document editor
- [web-llm](https://github.com/mlc-ai/web-llm) - Run LLM in the browser
- [teable](https://github.com/teableio/teable) & [apitable](https://github.com/apitable/apitable) - Teach me how to build an Airtable-like table.

### desktop app

- [electron](https://github.com/electron/electron) - Build cross-platform desktop apps
- [libsimple](https://github.com/wangfenjin/libsimple) - a sqlite extension for full-text search for CJK languages

## License

This project is licensed under the terms of the AGPL license.
