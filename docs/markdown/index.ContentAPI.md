# Interface: ContentAPI

[index](../wiki/index).ContentAPI

## Table of contents

### Properties

- [ContentInfoTooltip](../wiki/index.ContentAPI#contentinfotooltip)
- [contentTenantContext](../wiki/index.ContentAPI#contenttenantcontext)
- [getCTUrlPattern](../wiki/index.ContentAPI#getcturlpattern)
- [getViewPropsByCT](../wiki/index.ContentAPI#getviewpropsbyct)
- [hooks](../wiki/index.ContentAPI#hooks)
- [registerContentDetailCompartment](../wiki/index.ContentAPI#registercontentdetailcompartment)
- [registerContentDetailTab](../wiki/index.ContentAPI#registercontentdetailtab)
- [store](../wiki/index.ContentAPI#store)

### Methods

- [registerContentDetailAction](../wiki/index.ContentAPI#registercontentdetailaction)

## Properties

### ContentInfoTooltip

• **ContentInfoTooltip**: `FC`<[`ContentInfoTooltipProps`](../wiki/index.%3Cinternal%3E.ContentInfoTooltipProps)\>

#### Defined in

public/lib/api/api.types.ts:69

___

### contentTenantContext

• **contentTenantContext**: `Context`<`TenantContextValue`\>

#### Defined in

public/lib/api/api.types.ts:75

___

### getCTUrlPattern

• **getCTUrlPattern**: (`contentType`: [`ContentTypeSchema`](../wiki/index.ContentTypeSchema), `activeLanguage`: `string`, `moduleConfigName`: `string`, `site?`: `SiteResponse`) => `string`

#### Type declaration

▸ (`contentType`, `activeLanguage`, `moduleConfigName`, `site?`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `contentType` | [`ContentTypeSchema`](../wiki/index.ContentTypeSchema) |
| `activeLanguage` | `string` |
| `moduleConfigName` | `string` |
| `site?` | `SiteResponse` |

##### Returns

`string`

#### Defined in

public/lib/api/api.types.ts:72

___

### getViewPropsByCT

• **getViewPropsByCT**: (`contentType`: [`ContentTypeSchema`](../wiki/index.ContentTypeSchema), `values`: `FormikValues`, `activeLanguageKey?`: `string`) => { `schema`: `FormSchema` ; `values`: `FormikValues`  }

#### Type declaration

▸ (`contentType`, `values`, `activeLanguageKey?`): `Object`

##### Parameters

| Name | Type |
| :------ | :------ |
| `contentType` | [`ContentTypeSchema`](../wiki/index.ContentTypeSchema) |
| `values` | `FormikValues` |
| `activeLanguageKey?` | `string` |

##### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `schema` | `FormSchema` |
| `values` | `FormikValues` |

#### Defined in

public/lib/api/api.types.ts:71

___

### hooks

• **hooks**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `useContent` | () => [`LoadingState`, [`ContentSchema`](../wiki/index.ContentSchema)[], `undefined` \| ``null`` \| [`PagingSchema`](../wiki/index.%3Cinternal%3E.PagingSchema)] |

#### Defined in

public/lib/api/api.types.ts:66

___

### registerContentDetailCompartment

• **registerContentDetailCompartment**: <M\>(`name`: `string`, `options`: [`ExternalCompartmentOptions`](../wiki/index.ExternalCompartmentOptions)<`M`\>) => `void`

#### Type declaration

▸ <`M`\>(`name`, `options`): `void`

##### Type parameters

| Name | Type |
| :------ | :------ |
| `M` | [`ModuleValue`](../wiki/index.%3Cinternal%3E#modulevalue) |

##### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `options` | [`ExternalCompartmentOptions`](../wiki/index.ExternalCompartmentOptions)<`M`\> |

##### Returns

`void`

#### Defined in

public/lib/api/api.types.ts:70

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

public/lib/api/api.types.ts:74

___

### store

• **store**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `content` | { `facade`: `Pick`<[`ContentFacade`](../wiki/index.%3Cinternal%3E.ContentFacade), ``"getContentItem"`` \| ``"getContentItemBySlug"`` \| ``"getContent"`` \| ``"setBaseContentItem"``\> ; `service`: [`ContentApiService`](../wiki/index.%3Cinternal%3E.ContentApiService)  } |
| `content.facade` | `Pick`<[`ContentFacade`](../wiki/index.%3Cinternal%3E.ContentFacade), ``"getContentItem"`` \| ``"getContentItemBySlug"`` \| ``"getContent"`` \| ``"setBaseContentItem"``\> |
| `content.service` | [`ContentApiService`](../wiki/index.%3Cinternal%3E.ContentApiService) |

#### Defined in

public/lib/api/api.types.ts:57

## Methods

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

public/lib/api/api.types.ts:73
