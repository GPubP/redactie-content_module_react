# Module: Module API

## Table of contents

### References

- [ContentInfoTooltip](../wiki/Module%20API#contentinfotooltip)

### Variables

- [contentTenantContext](../wiki/Module%20API#contenttenantcontext)
- [hooks](../wiki/Module%20API#hooks)
- [store](../wiki/Module%20API#store)

### Functions

- [getCTUrlPattern](../wiki/Module%20API#getcturlpattern)
- [getViewPropsByCT](../wiki/Module%20API#getviewpropsbyct)
- [registerContentDetailAction](../wiki/Module%20API#registercontentdetailaction)
- [registerContentDetailCompartment](../wiki/Module%20API#registercontentdetailcompartment)
- [registerContentDetailTab](../wiki/Module%20API#registercontentdetailtab)

## References

### ContentInfoTooltip

Re-exports [ContentInfoTooltip](../wiki/index#contentinfotooltip)

## Variables

### contentTenantContext

• `Const` **contentTenantContext**: `Context`

#### Defined in

node_modules/@redactie/utils/dist/context/TenantContext/TenantContext.d.ts:3

___

### hooks

• `Const` **hooks**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `useContent` | () => [`LoadingState`, [`ContentSchema`](../wiki/index.ContentSchema)[], `undefined` \| ``null`` \| `PagingSchema`] |

#### Defined in

public/lib/api/hooks.ts:3

___

### store

• `Const` **store**: [`ContentAPI`](../wiki/index.ContentAPI)[``"store"``]

#### Defined in

public/lib/api/store.ts:6

## Functions

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

public/lib/helpers/getCTUrlPattern.ts:5

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

public/lib/helpers/getViewPropsByCT.ts:10

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

public/lib/api/registerContentDetailAction.ts:3

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

public/lib/api/registerContentDetailCompartment.ts:7

___

### registerContentDetailTab

▸ **registerContentDetailTab**(`name`, `options`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `options` | [`ExternalTabOptions`](../wiki/index.ExternalTabOptions) |

#### Returns

`void`

#### Defined in

public/lib/api/registerContentDetailTab.ts:3
