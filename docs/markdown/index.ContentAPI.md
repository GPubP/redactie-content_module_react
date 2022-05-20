# Interface: ContentAPI

[index](../wiki/index).ContentAPI

## Table of contents

### Properties

- [ContentInfoTooltip](../wiki/index.ContentAPI#contentinfotooltip)
- [contentTenantContext](../wiki/index.ContentAPI#contenttenantcontext)
- [hooks](../wiki/index.ContentAPI#hooks)
- [registerContentDetailTab](../wiki/index.ContentAPI#registercontentdetailtab)
- [store](../wiki/index.ContentAPI#store)

### Methods

- [getCTUrlPattern](../wiki/index.ContentAPI#getcturlpattern)
- [getViewPropsByCT](../wiki/index.ContentAPI#getviewpropsbyct)
- [registerContentDetailAction](../wiki/index.ContentAPI#registercontentdetailaction)
- [registerContentDetailCompartment](../wiki/index.ContentAPI#registercontentdetailcompartment)

## Properties

### ContentInfoTooltip

• **ContentInfoTooltip**: `FC`<`ContentInfoTooltipProps`\>

#### Defined in

public/lib/api/api.types.ts:67

___

### contentTenantContext

• **contentTenantContext**: `Context`<`TenantContextValue`\>

#### Defined in

public/lib/api/api.types.ts:87

___

### hooks

• **hooks**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `useContent` | () => [`LoadingState`, [`ContentSchema`](../wiki/index.ContentSchema)[], `undefined` \| ``null`` \| `PagingSchema`] |

#### Defined in

public/lib/api/api.types.ts:63

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

public/lib/api/api.types.ts:86

___

### store

• **store**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `content` | { `facade`: `Pick`<`ContentFacade`, ``"getContentItem"`` \| ``"getContentItemBySlug"`` \| ``"getContent"`` \| ``"setBaseContentItem"``\> ; `service`: `ContentApiService`  } |
| `content.facade` | `Pick`<`ContentFacade`, ``"getContentItem"`` \| ``"getContentItemBySlug"`` \| ``"getContent"`` \| ``"setBaseContentItem"``\> |
| `content.service` | `ContentApiService` |

#### Defined in

public/lib/api/api.types.ts:54

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

public/lib/api/api.types.ts:79

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

public/lib/api/api.types.ts:72

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

public/lib/api/api.types.ts:85

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

public/lib/api/api.types.ts:68
