# Class: ContentApiService

[index](../wiki/index).[<internal>](../wiki/index.%3Cinternal%3E).ContentApiService

## Table of contents

### Constructors

- [constructor](../wiki/index.%3Cinternal%3E.ContentApiService#constructor)

### Methods

- [createContentItem](../wiki/index.%3Cinternal%3E.ContentApiService#createcontentitem)
- [getContent](../wiki/index.%3Cinternal%3E.ContentApiService#getcontent)
- [getContentItem](../wiki/index.%3Cinternal%3E.ContentApiService#getcontentitem)
- [getContentItemBySlug](../wiki/index.%3Cinternal%3E.ContentApiService#getcontentitembyslug)
- [removeContentItem](../wiki/index.%3Cinternal%3E.ContentApiService#removecontentitem)
- [updateContentItem](../wiki/index.%3Cinternal%3E.ContentApiService#updatecontentitem)
- [validateSlug](../wiki/index.%3Cinternal%3E.ContentApiService#validateslug)

## Constructors

### constructor

• **new ContentApiService**()

## Methods

### createContentItem

▸ **createContentItem**(`siteId`, `data`): `Promise`<``null`` \| [`ContentSchema`](../wiki/index.ContentSchema)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `siteId` | `string` |
| `data` | [`ContentCreateSchema`](../wiki/index.%3Cinternal%3E.ContentCreateSchema) |

#### Returns

`Promise`<``null`` \| [`ContentSchema`](../wiki/index.ContentSchema)\>

#### Defined in

public/lib/services/content/content.service.ts:32

___

### getContent

▸ **getContent**(`siteId`, `contentSearchParams`): `Promise`<``null`` \| [`ContentsSchema`](../wiki/index.%3Cinternal%3E.ContentsSchema)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `siteId` | `string` |
| `contentSearchParams` | `SearchParams` |

#### Returns

`Promise`<``null`` \| [`ContentsSchema`](../wiki/index.%3Cinternal%3E.ContentsSchema)\>

#### Defined in

public/lib/services/content/content.service.ts:19

___

### getContentItem

▸ **getContentItem**(`siteId`, `uuid`): `Promise`<``null`` \| [`ContentSchema`](../wiki/index.ContentSchema)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `siteId` | `string` |
| `uuid` | `string` |

#### Returns

`Promise`<``null`` \| [`ContentSchema`](../wiki/index.ContentSchema)\>

#### Defined in

public/lib/services/content/content.service.ts:63

___

### getContentItemBySlug

▸ **getContentItemBySlug**(`siteId`, `uuid`): `Promise`<`undefined` \| [`ContentSchema`](../wiki/index.ContentSchema)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `siteId` | `string` |
| `uuid` | `string` |

#### Returns

`Promise`<`undefined` \| [`ContentSchema`](../wiki/index.ContentSchema)\>

#### Defined in

public/lib/services/content/content.service.ts:69

___

### removeContentItem

▸ **removeContentItem**(`siteId`, `contentId`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `siteId` | `string` |
| `contentId` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

public/lib/services/content/content.service.ts:43

___

### updateContentItem

▸ **updateContentItem**(`siteId`, `uuid`, `data`): `Promise`<``null`` \| [`ContentSchema`](../wiki/index.ContentSchema)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `siteId` | `string` |
| `uuid` | `string` |
| `data` | [`ContentUpdateSchema`](../wiki/index.%3Cinternal%3E.ContentUpdateSchema) |

#### Returns

`Promise`<``null`` \| [`ContentSchema`](../wiki/index.ContentSchema)\>

#### Defined in

public/lib/services/content/content.service.ts:47

___

### validateSlug

▸ **validateSlug**(`siteId`, `payload`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `siteId` | `string` |
| `payload` | [`ValidateSlugPayload`](../wiki/index.%3Cinternal%3E.ValidateSlugPayload) |

#### Returns

`Promise`<`void`\>

#### Defined in

public/lib/services/content/content.service.ts:73
