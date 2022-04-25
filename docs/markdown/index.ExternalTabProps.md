# Interface: ExternalTabProps

[index](../wiki/index).ExternalTabProps

## Table of contents

### Properties

- [contentId](../wiki/index.ExternalTabProps#contentid-1)
- [contentItem](../wiki/index.ExternalTabProps#contentitem-1)
- [contentType](../wiki/index.ExternalTabProps#contenttype-1)
- [isLoading](../wiki/index.ExternalTabProps#isloading-1)
- [siteId](../wiki/index.ExternalTabProps#siteid-1)
- [value](../wiki/index.ExternalTabProps#value-1)
- [workflow](../wiki/index.ExternalTabProps#workflow-1)

### Methods

- [onCancel](../wiki/index.ExternalTabProps#oncancel-1)
- [onSubmit](../wiki/index.ExternalTabProps#onsubmit-1)
- [updateContentItem](../wiki/index.ExternalTabProps#updatecontentitem-1)

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

• **value**: `ExternalStandaloneTabValue` \| `ExternalTabValue`

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
| `value` | `ExternalTabValue` |

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
