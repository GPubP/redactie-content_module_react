# Interface: ExternalActionOptions

[index](../wiki/index).ExternalActionOptions

## Table of contents

### Properties

- [activeLanguage](../wiki/index.ExternalActionOptions#activelanguage)
- [component](../wiki/index.ExternalActionOptions#component)
- [module](../wiki/index.ExternalActionOptions#module)
- [replace](../wiki/index.ExternalActionOptions#replace)

### Methods

- [show](../wiki/index.ExternalActionOptions#show)

## Properties

### activeLanguage

• `Optional` **activeLanguage**: `string`

#### Defined in

public/lib/store/api/externalActions/externalActions.model.ts:14

___

### component

• **component**: `FC`<[`ExternalActionProps`](../wiki/index.ExternalActionProps)\>

#### Defined in

public/lib/store/api/externalActions/externalActions.model.ts:11

___

### module

• **module**: `string`

#### Defined in

public/lib/store/api/externalActions/externalActions.model.ts:10

___

### replace

• `Optional` **replace**: `boolean`

#### Defined in

public/lib/store/api/externalActions/externalActions.model.ts:13

## Methods

### show

▸ `Optional` **show**(`contentType`, `site`, `content`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `contentType` | [`ContentTypeSchema`](../wiki/index.ContentTypeSchema) |
| `site` | `SiteResponse` |
| `content` | [`ContentSchema`](../wiki/index.ContentSchema) |

#### Returns

`boolean`

#### Defined in

public/lib/store/api/externalActions/externalActions.model.ts:12
