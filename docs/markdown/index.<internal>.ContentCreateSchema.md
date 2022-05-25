# Interface: ContentCreateSchema

[index](../wiki/index).[<internal>](../wiki/index.%3Cinternal%3E).ContentCreateSchema

## Table of contents

### Properties

- [fields](../wiki/index.%3Cinternal%3E.ContentCreateSchema#fields)
- [meta](../wiki/index.%3Cinternal%3E.ContentCreateSchema#meta)
- [modulesData](../wiki/index.%3Cinternal%3E.ContentCreateSchema#modulesdata)
- [uuid](../wiki/index.%3Cinternal%3E.ContentCreateSchema#uuid)

## Properties

### fields

• **fields**: `Record`<`string`, `any`\>

#### Defined in

public/lib/services/content/content.service.types.ts:105

___

### meta

• **meta**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `activeLanguages` | `string`[] |
| `contentType` | `string` |
| `description?` | `string` |
| `label` | `string` |
| `lang` | `string` |
| `publishTime?` | ``null`` \| `string` |
| `published` | `boolean` |
| `site` | `string` |
| `slug` | `Record`<`string`, `string`\> |
| `status` | `string` |
| `translationId` | `string` |
| `unpublishTime?` | ``null`` \| `string` |
| `urlPath?` | `Record`<`string`, { `pattern`: `string` ; `standardPattern`: `string` ; `standardValue`: `string` ; `value`: `string`  }\> |
| `workflowState` | `string` |

#### Defined in

public/lib/services/content/content.service.types.ts:80

___

### modulesData

• `Optional` **modulesData**: `Record`<`string`, [`ModuleValue`](../wiki/index.%3Cinternal%3E#modulevalue)\>

#### Defined in

public/lib/services/content/content.service.types.ts:104

___

### uuid

• `Optional` **uuid**: `string`

#### Defined in

public/lib/services/content/content.service.types.ts:106
