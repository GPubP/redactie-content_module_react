# Interface: ExternalActionOptions

[index](../wiki/index).ExternalActionOptions

## Table of contents

### Properties

- [component](../wiki/index.ExternalActionOptions#component-1)
- [module](../wiki/index.ExternalActionOptions#module-1)
- [replace](../wiki/index.ExternalActionOptions#replace-1)

### Methods

- [show](../wiki/index.ExternalActionOptions#show-1)

## Properties

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
