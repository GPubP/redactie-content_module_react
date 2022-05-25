# Class: ContentFacade

[index](../wiki/index).[<internal>](../wiki/index.%3Cinternal%3E).ContentFacade

## Hierarchy

- `BaseEntityFacade`<[`ContentStore`](../wiki/index.%3Cinternal%3E.ContentStore), [`ContentApiService`](../wiki/index.%3Cinternal%3E.ContentApiService), [`ContentQuery`](../wiki/index.%3Cinternal%3E.ContentQuery)\>

  ↳ **`ContentFacade`**

## Table of contents

### Constructors

- [constructor](../wiki/index.%3Cinternal%3E.ContentFacade#constructor)

### Properties

- [alertContainerProps](../wiki/index.%3Cinternal%3E.ContentFacade#alertcontainerprops)
- [baseContentItem$](../wiki/index.%3Cinternal%3E.ContentFacade#basecontentitem$)
- [baseContentItemFetching$](../wiki/index.%3Cinternal%3E.ContentFacade#basecontentitemfetching$)
- [content$](../wiki/index.%3Cinternal%3E.ContentFacade#content$)
- [contentItem$](../wiki/index.%3Cinternal%3E.ContentFacade#contentitem$)
- [contentItemDraft$](../wiki/index.%3Cinternal%3E.ContentFacade#contentitemdraft$)
- [isPublishing$](../wiki/index.%3Cinternal%3E.ContentFacade#ispublishing$)
- [meta$](../wiki/index.%3Cinternal%3E.ContentFacade#meta$)

### Methods

- [clearContentItem](../wiki/index.%3Cinternal%3E.ContentFacade#clearcontentitem)
- [clearContentItemDraft](../wiki/index.%3Cinternal%3E.ContentFacade#clearcontentitemdraft)
- [clearError](../wiki/index.%3Cinternal%3E.ContentFacade#clearerror)
- [createContentItem](../wiki/index.%3Cinternal%3E.ContentFacade#createcontentitem)
- [getBaseContentItem](../wiki/index.%3Cinternal%3E.ContentFacade#getbasecontentitem)
- [getContent](../wiki/index.%3Cinternal%3E.ContentFacade#getcontent)
- [getContentItem](../wiki/index.%3Cinternal%3E.ContentFacade#getcontentitem)
- [getContentItemBySlug](../wiki/index.%3Cinternal%3E.ContentFacade#getcontentitembyslug)
- [hasBaseContentItem](../wiki/index.%3Cinternal%3E.ContentFacade#hasbasecontentitem)
- [removeContentItem](../wiki/index.%3Cinternal%3E.ContentFacade#removecontentitem)
- [setBaseContentItem](../wiki/index.%3Cinternal%3E.ContentFacade#setbasecontentitem)
- [setContentItemDraft](../wiki/index.%3Cinternal%3E.ContentFacade#setcontentitemdraft)
- [setIsCreating](../wiki/index.%3Cinternal%3E.ContentFacade#setiscreating)
- [setIsPublishing](../wiki/index.%3Cinternal%3E.ContentFacade#setispublishing)
- [setIsUpdating](../wiki/index.%3Cinternal%3E.ContentFacade#setisupdating)
- [updateContentFieldsDraft](../wiki/index.%3Cinternal%3E.ContentFacade#updatecontentfieldsdraft)
- [updateContentItem](../wiki/index.%3Cinternal%3E.ContentFacade#updatecontentitem)
- [updateContentItemDraft](../wiki/index.%3Cinternal%3E.ContentFacade#updatecontentitemdraft)
- [updateContentMetaDraft](../wiki/index.%3Cinternal%3E.ContentFacade#updatecontentmetadraft)
- [updateContentModuleDraft](../wiki/index.%3Cinternal%3E.ContentFacade#updatecontentmoduledraft)

## Constructors

### constructor

• **new ContentFacade**(`store`, `service`, `query`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `store` | [`ContentStore`](../wiki/index.%3Cinternal%3E.ContentStore) |
| `service` | [`ContentApiService`](../wiki/index.%3Cinternal%3E.ContentApiService) |
| `query` | [`ContentQuery`](../wiki/index.%3Cinternal%3E.ContentQuery) |

#### Inherited from

BaseEntityFacade<ContentStore, ContentApiService, ContentQuery\>.constructor

#### Defined in

node_modules/@redactie/utils/dist/store/baseEntity/baseEntity.facade.d.ts:7

## Properties

### alertContainerProps

• `Readonly` **alertContainerProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | { `containerId`: [`ALERT_CONTAINER_IDS`](../wiki/index.%3Cinternal%3E.ALERT_CONTAINER_IDS) = ALERT\_CONTAINER\_IDS.contentCreate } |
| `create.containerId` | [`ALERT_CONTAINER_IDS`](../wiki/index.%3Cinternal%3E.ALERT_CONTAINER_IDS) |
| `remove` | { `containerId`: [`ALERT_CONTAINER_IDS`](../wiki/index.%3Cinternal%3E.ALERT_CONTAINER_IDS) = ALERT\_CONTAINER\_IDS.contentRemove } |
| `remove.containerId` | [`ALERT_CONTAINER_IDS`](../wiki/index.%3Cinternal%3E.ALERT_CONTAINER_IDS) |
| `update` | { `containerId`: [`ALERT_CONTAINER_IDS`](../wiki/index.%3Cinternal%3E.ALERT_CONTAINER_IDS) = ALERT\_CONTAINER\_IDS.contentEdit } |
| `update.containerId` | [`ALERT_CONTAINER_IDS`](../wiki/index.%3Cinternal%3E.ALERT_CONTAINER_IDS) |

#### Defined in

public/lib/store/content/content.facade.ts:22

___

### baseContentItem$

• `Readonly` **baseContentItem$**: `Observable`<`undefined` \| [`ContentSchema`](../wiki/index.ContentSchema)\>

#### Defined in

public/lib/store/content/content.facade.ts:36

___

### baseContentItemFetching$

• `Readonly` **baseContentItemFetching$**: `Observable`<`LoadingState`\>

#### Defined in

public/lib/store/content/content.facade.ts:37

___

### content$

• `Readonly` **content$**: `Observable`<[`ContentSchema`](../wiki/index.ContentSchema)[]\>

#### Defined in

public/lib/store/content/content.facade.ts:35

___

### contentItem$

• `Readonly` **contentItem$**: `Observable`<`undefined` \| [`ContentSchema`](../wiki/index.ContentSchema)\>

#### Defined in

public/lib/store/content/content.facade.ts:38

___

### contentItemDraft$

• `Readonly` **contentItemDraft$**: `Observable`<`undefined` \| [`ContentSchema`](../wiki/index.ContentSchema)\>

#### Defined in

public/lib/store/content/content.facade.ts:39

___

### isPublishing$

• `Readonly` **isPublishing$**: `Observable`<`LoadingState`\>

#### Defined in

public/lib/store/content/content.facade.ts:40

___

### meta$

• `Readonly` **meta$**: `Observable`<`undefined` \| [`PagingSchema`](../wiki/index.%3Cinternal%3E.PagingSchema)\>

#### Defined in

public/lib/store/content/content.facade.ts:34

## Methods

### clearContentItem

▸ **clearContentItem**(): `void`

#### Returns

`void`

#### Defined in

public/lib/store/content/content.facade.ts:375

___

### clearContentItemDraft

▸ **clearContentItemDraft**(): `void`

#### Returns

`void`

#### Defined in

public/lib/store/content/content.facade.ts:369

___

### clearError

▸ **clearError**(): `void`

#### Returns

`void`

#### Defined in

public/lib/store/content/content.facade.ts:487

___

### createContentItem

▸ **createContentItem**(`siteId`, `data`): `Promise`<``null`` \| `void` \| [`ContentSchema`](../wiki/index.ContentSchema)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `siteId` | `string` |
| `data` | [`ContentCreateSchema`](../wiki/index.%3Cinternal%3E.ContentCreateSchema) |

#### Returns

`Promise`<``null`` \| `void` \| [`ContentSchema`](../wiki/index.ContentSchema)\>

#### Defined in

public/lib/store/content/content.facade.ts:187

___

### getBaseContentItem

▸ **getBaseContentItem**(`siteId`, `uuid`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `siteId` | `string` |
| `uuid` | `string` |

#### Returns

`void`

#### Defined in

public/lib/store/content/content.facade.ts:114

___

### getContent

▸ **getContent**(`siteId`, `searchParams`): `Promise`<`void`\>

API integration

#### Parameters

| Name | Type |
| :------ | :------ |
| `siteId` | `string` |
| `searchParams` | `SearchParams` |

#### Returns

`Promise`<`void`\>

#### Defined in

public/lib/store/content/content.facade.ts:57

___

### getContentItem

▸ **getContentItem**(`siteId`, `uuid`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `siteId` | `string` |
| `uuid` | `string` |

#### Returns

`void`

#### Defined in

public/lib/store/content/content.facade.ts:79

___

### getContentItemBySlug

▸ **getContentItemBySlug**(`siteId`, `uuid`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `siteId` | `string` |
| `uuid` | `string` |

#### Returns

`void`

#### Defined in

public/lib/store/content/content.facade.ts:151

___

### hasBaseContentItem

▸ **hasBaseContentItem**(`baseContentItemId`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseContentItemId` | `string` |

#### Returns

`boolean`

#### Defined in

public/lib/store/content/content.facade.ts:499

___

### removeContentItem

▸ **removeContentItem**(`siteId`, `contentId`, `data`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `siteId` | `string` |
| `contentId` | `string` |
| `data` | [`ContentSchema`](../wiki/index.ContentSchema) |

#### Returns

`Promise`<`void`\>

#### Defined in

public/lib/store/content/content.facade.ts:222

___

### setBaseContentItem

▸ **setBaseContentItem**(`baseContentItem`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseContentItem` | [`ContentSchema`](../wiki/index.ContentSchema) |

#### Returns

`void`

#### Defined in

public/lib/store/content/content.facade.ts:493

___

### setContentItemDraft

▸ **setContentItemDraft**(`data`, `contentType`): `Promise`<`void`\>

Helpers

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`ContentSchema`](../wiki/index.ContentSchema) |
| `contentType` | [`ContentTypeSchema`](../wiki/index.ContentTypeSchema) |

#### Returns

`Promise`<`void`\>

#### Defined in

public/lib/store/content/content.facade.ts:305

___

### setIsCreating

▸ **setIsCreating**(`isCreating?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `isCreating` | `boolean` | `false` |

#### Returns

`void`

#### Defined in

public/lib/store/content/content.facade.ts:50

___

### setIsPublishing

▸ **setIsPublishing**(`isPublishing?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `isPublishing` | `boolean` | `false` |

#### Returns

`void`

#### Defined in

public/lib/store/content/content.facade.ts:46

___

### setIsUpdating

▸ **setIsUpdating**(`isUpdating?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `isUpdating` | `boolean` | `false` |

#### Returns

`void`

#### Defined in

public/lib/store/content/content.facade.ts:42

___

### updateContentFieldsDraft

▸ **updateContentFieldsDraft**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Record`<`string`, `any`\> |

#### Returns

`void`

#### Defined in

public/lib/store/content/content.facade.ts:387

___

### updateContentItem

▸ **updateContentItem**(`siteId`, `uuid`, `data`, `publish?`, `unsetLoaders?`): `Promise`<``null`` \| [`ContentSchema`](../wiki/index.ContentSchema)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `siteId` | `string` | `undefined` |
| `uuid` | `string` | `undefined` |
| `data` | [`ContentSchema`](../wiki/index.ContentSchema) | `undefined` |
| `publish` | `boolean` | `false` |
| `unsetLoaders` | `boolean` | `true` |

#### Returns

`Promise`<``null`` \| [`ContentSchema`](../wiki/index.ContentSchema)\>

#### Defined in

public/lib/store/content/content.facade.ts:247

___

### updateContentItemDraft

▸ **updateContentItemDraft**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`ContentSchema`](../wiki/index.ContentSchema) |

#### Returns

`void`

#### Defined in

public/lib/store/content/content.facade.ts:381

___

### updateContentMetaDraft

▸ **updateContentMetaDraft**(`data`, `contentType?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Partial`<[`ContentMeta`](../wiki/index.%3Cinternal%3E.ContentMeta)\> |
| `contentType?` | [`ContentTypeSchema`](../wiki/index.ContentTypeSchema) |

#### Returns

`Promise`<`void`\>

#### Defined in

public/lib/store/content/content.facade.ts:403

___

### updateContentModuleDraft

▸ **updateContentModuleDraft**(`compartmentName`, `data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `compartmentName` | `string` |
| `data` | `any` |

#### Returns

`void`

#### Defined in

public/lib/store/content/content.facade.ts:475
