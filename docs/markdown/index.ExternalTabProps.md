# Interface: ExternalTabProps

[index](../wiki/index).ExternalTabProps

## Table of contents

### Properties

- [contentId](../wiki/index.ExternalTabProps#contentid)
- [contentItem](../wiki/index.ExternalTabProps#contentitem)
- [contentType](../wiki/index.ExternalTabProps#contenttype)
- [isLoading](../wiki/index.ExternalTabProps#isloading)
- [siteId](../wiki/index.ExternalTabProps#siteid)
- [value](../wiki/index.ExternalTabProps#value)
- [workflow](../wiki/index.ExternalTabProps#workflow)

### Methods

- [onCancel](../wiki/index.ExternalTabProps#oncancel)
- [onSubmit](../wiki/index.ExternalTabProps#onsubmit)
- [updateContentItem](../wiki/index.ExternalTabProps#updatecontentitem)

## Properties

### contentId

• **contentId**: `string`

#### Defined in

public/lib/views/ContentDetailExternal/ContentDetailExternal.types.ts:19

___

### contentItem

• **contentItem**: [`ContentSchema`](../wiki/index.ContentSchema)

#### Defined in

public/lib/views/ContentDetailExternal/ContentDetailExternal.types.ts:22

___

### contentType

• **contentType**: [`ContentTypeSchema`](../wiki/index.ContentTypeSchema)

#### Defined in

public/lib/views/ContentDetailExternal/ContentDetailExternal.types.ts:21

___

### isLoading

• **isLoading**: `boolean`

#### Defined in

public/lib/views/ContentDetailExternal/ContentDetailExternal.types.ts:24

___

### siteId

• **siteId**: `string`

#### Defined in

public/lib/views/ContentDetailExternal/ContentDetailExternal.types.ts:20

___

### value

• **value**: [`ExternalStandaloneTabValue`](../wiki/index.%3Cinternal%3E#externalstandalonetabvalue) \| [`ExternalTabValue`](../wiki/index.%3Cinternal%3E.ExternalTabValue)

#### Defined in

public/lib/views/ContentDetailExternal/ContentDetailExternal.types.ts:23

___

### workflow

• **workflow**: `WorkflowDetailResponse`

#### Defined in

public/lib/views/ContentDetailExternal/ContentDetailExternal.types.ts:28

## Methods

### onCancel

▸ **onCancel**(): `void`

#### Returns

`void`

#### Defined in

public/lib/views/ContentDetailExternal/ContentDetailExternal.types.ts:26

___

### onSubmit

▸ **onSubmit**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`ExternalTabValue`](../wiki/index.%3Cinternal%3E.ExternalTabValue) |

#### Returns

`void`

#### Defined in

public/lib/views/ContentDetailExternal/ContentDetailExternal.types.ts:25

___

### updateContentItem

▸ **updateContentItem**(`e`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `e` | [`ContentSchema`](../wiki/index.ContentSchema) |

#### Returns

`void`

#### Defined in

public/lib/views/ContentDetailExternal/ContentDetailExternal.types.ts:27
