# Interface: ContentAPI

[index](../wiki/index).ContentAPI

## Table of contents

### Properties

- [ContentInfoTooltip](../wiki/index.ContentAPI#contentinfotooltip-1)
- [contentTenantContext](../wiki/index.ContentAPI#contenttenantcontext-1)
- [hooks](../wiki/index.ContentAPI#hooks-1)
- [registerContentDetailTab](../wiki/index.ContentAPI#registercontentdetailtab-1)
- [store](../wiki/index.ContentAPI#store-1)

### Methods

- [getCTUrlPattern](../wiki/index.ContentAPI#getcturlpattern-1)
- [getViewPropsByCT](../wiki/index.ContentAPI#getviewpropsbyct-1)
- [registerContentDetailAction](../wiki/index.ContentAPI#registercontentdetailaction-1)
- [registerContentDetailCompartment](../wiki/index.ContentAPI#registercontentdetailcompartment-1)

## Properties

### ContentInfoTooltip

• **ContentInfoTooltip**: `FC`<`ContentInfoTooltipProps`\>

#### Defined in

public/lib/api/api.types.ts:62

___

### contentTenantContext

• **contentTenantContext**: `Context`<`TenantContextValue`\>

#### Defined in

public/lib/api/api.types.ts:82

___

### hooks

• **hooks**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `useContent` | () => [`LoadingState`, [`ContentSchema`](../wiki/index.ContentSchema)[], `undefined` \| ``null`` \| `PagingSchema`] |

#### Defined in

public/lib/api/api.types.ts:58

___

### registerContentDetailTab

• **registerContentDetailTab**: (`name`: `string`, `options`: [`ExternalTabOptions`](../wiki/index.ExternalTabOptions)) => `void`

#### Type declaration

▸ (`name`, `options`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `options` | [`ExternalTabOptions`](../wiki/index.ExternalTabOptions) |

##### Returns

`void`

#### Defined in

public/lib/api/api.types.ts:81

___

### store

• **store**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `content` | { `facade`: `Pick`<`ContentFacade`, ``"getContentItem"`` \| ``"getContentItemBySlug"`` \| ``"getContent"``\> ; `service`: `ContentApiService`  } |
| `content.facade` | `Pick`<`ContentFacade`, ``"getContentItem"`` \| ``"getContentItemBySlug"`` \| ``"getContent"``\> |
| `content.service` | `ContentApiService` |

#### Defined in

public/lib/api/api.types.ts:52

## Methods

### getCTUrlPattern

▸ **getCTUrlPattern**(`contentType`, `activeLanguage`, `moduleConfigName`, `site?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `contentType` | [`ContentTypeSchema`](../wiki/index.ContentTypeSchema) |
| `activeLanguage` | `string` |
| `moduleConfigName` | `string` |
| `site?` | `SiteResponse` |

#### Returns

`string`

#### Defined in

public/lib/api/api.types.ts:74

___

### getViewPropsByCT

▸ **getViewPropsByCT**(`contentType`, `values`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `contentType` | [`ContentTypeSchema`](../wiki/index.ContentTypeSchema) |
| `values` | `FormikValues` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `schema` | `FormSchema` |
| `values` | `FormikValues` |

#### Defined in

public/lib/api/api.types.ts:67

___

### registerContentDetailAction

▸ **registerContentDetailAction**(`name`, `options`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `options` | [`ExternalActionOptions`](../wiki/index.ExternalActionOptions) |

#### Returns

`void`

#### Defined in

public/lib/api/api.types.ts:80

___

### registerContentDetailCompartment

▸ **registerContentDetailCompartment**<`M`\>(`name`, `options`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `M` | `ModuleValue` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `options` | [`ExternalCompartmentOptions`](../wiki/index.ExternalCompartmentOptions)<`M`\> |

#### Returns

`void`

#### Defined in

public/lib/api/api.types.ts:63
