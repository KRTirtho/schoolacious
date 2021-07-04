<h1><p align="center">Zainul</p></h1>

zainul is the react frontend of the project designed with material-ui & tailwind-css

If you're not familiar with some of the technology used in this package go to [CONTRIBUTION.md#learning-materials](../CONTRIBUTION.md#learning-materials) section for learning materials related to this project

> **Important:** Follow the coding style of the eslint & prettier plugin configured for this project. Use spaces instead of tabs for indentation

> **Tip!:** if your editor supports eslint & prettier formatter, please use. Don't forget to configure them locally for the project

## Project folder structure

```txt
src/
├─ assets/
│  ├─ index.ts
│  ├─ image/
│  ├─ video/
│  ├─ audio/
├─ components/              [shared ones]
│  ├─ <component-name>/     [name in PascalCase]
│  │  ├─ <component>.tsx
├─ configs/
│  ├─ enums.ts
│  ├─ constants.ts
├─ hooks/
│  ├─ use<hook-name>.ts
├─ pages/
│  ├─ <page-name>/      [small letters '-' separated]
│  │  ├─ components/    [route specific]
│  │  ├─ <route-name>.tsx
├─ routing/   [RouteConfig, 404, Private, RoleRoute etc.]
├─ styles/    [client styles]
│  ├─ theme.ts
├─ state/
│  ├─ <name>-store.ts
├─ services/
│  ├─ api/    [API bounding functions with DI services]
│  ├─ <business-logic-stuff>/
├─ utils/     [Helper functions]

```

## Contribution

Contribute however you want following the [CONTRIBUTION.md](../CONTRIBUTION.md)
