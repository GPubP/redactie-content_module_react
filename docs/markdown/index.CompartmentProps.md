# Interface: CompartmentProps<M, S\>

[index](../wiki/index).CompartmentProps

## Type parameters

| Name | Type |
| :------ | :------ |
| `M` | [`ModuleValue`](../wiki/index#modulevalue-1) |
| `S` | [`ModuleSettings`](../wiki/index.ModuleSettings) \| `CtTypeSettings` \| [`ContentTypeSchema`](../wiki/index.ContentTypeSchema) \| `undefined` |

## Table of contents

### Properties

- [activeLanguage](../wiki/index.CompartmentProps#activelanguage-1)
- [allowedTransitions](../wiki/index.CompartmentProps#allowedtransitions-1)
- [contentItem](../wiki/index.CompartmentProps#contentitem-1)
- [contentType](../wiki/index.CompartmentProps#contenttype-1)
- [contentValue](../wiki/index.CompartmentProps#contentvalue-1)
- [isCreating](../wiki/index.CompartmentProps#iscreating-1)
- [isValid](../wiki/index.CompartmentProps#isvalid-1)
- [machine](../wiki/index.CompartmentProps#machine-1)
- [settings](../wiki/index.CompartmentProps#settings-1)
- [site](../wiki/index.CompartmentProps#site-1)
- [value](../wiki/index.CompartmentProps#value-1)
- [workflow](../wiki/index.CompartmentProps#workflow-1)

### Methods

- [formikRef](../wiki/index.CompartmentProps#formikref-1)
- [onChange](../wiki/index.CompartmentProps#onchange-1)
- [updateContent](../wiki/index.CompartmentProps#updatecontent-1)
- [updateContentMeta](../wiki/index.CompartmentProps#updatecontentmeta-1)

## Properties

### activeLanguage

• `Optional` **activeLanguage**: `string`

#### Defined in

public/lib/views/ContentForm/ContentForm.types.tsx:81

___

### allowedTransitions

• `Optional` **allowedTransitions**: `string`[]

#### Defined in

public/lib/views/ContentForm/ContentForm.types.tsx:80

___

### contentItem

• **contentItem**: `undefined` \| [`ContentSchema`](../wiki/index.ContentSchema)

#### Defined in

public/lib/views/ContentForm/ContentForm.types.tsx:68

___

### contentType

• **contentType**: [`ContentTypeSchema`](../wiki/index.ContentTypeSchema)

#### Defined in

public/lib/views/ContentForm/ContentForm.types.tsx:66

___

### contentValue

• **contentValue**: `undefined` \| [`ContentSchema`](../wiki/index.ContentSchema)

#### Defined in

public/lib/views/ContentForm/ContentForm.types.tsx:67

___

### isCreating

• **isCreating**: `boolean`

#### Defined in

public/lib/views/ContentForm/ContentForm.types.tsx:72

___

### isValid

• **isValid**: `boolean`

#### Defined in

public/lib/views/ContentForm/ContentForm.types.tsx:71

___

### machine

• `Optional` **machine**: `StateMachine`<`StateMachineContext`, `any`, `StateMachineEvent`, { `context`: `StateMachineContext` ; `value`: `any`  }, `ActionObject`<`StateMachineContext`, `StateMachineEvent`\>\>

#### Defined in

public/lib/views/ContentForm/ContentForm.types.tsx:79

___

### settings

• **settings**: `S`

#### Defined in

public/lib/views/ContentForm/ContentForm.types.tsx:69

___

### site

• `Optional` **site**: `SiteResponse`

#### Defined in

public/lib/views/ContentForm/ContentForm.types.tsx:77

___

### value

• **value**: `M`

#### Defined in

public/lib/views/ContentForm/ContentForm.types.tsx:70

___

### workflow

• `Optional` **workflow**: `WorkflowDetailResponse`

#### Defined in

public/lib/views/ContentForm/ContentForm.types.tsx:78

## Methods

### formikRef

▸ `Optional` **formikRef**(`instance`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `instance` | ``null`` \| `FormikProps`<`FormikValues`\> |

#### Returns

`void`

#### Defined in

public/lib/views/ContentForm/ContentForm.types.tsx:73

___

### onChange

▸ **onChange**(`e`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `e` | `M` |

#### Returns

`void`

#### Defined in

public/lib/views/ContentForm/ContentForm.types.tsx:74

___

### updateContent

▸ **updateContent**(`e`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `e` | [`ContentSchema`](../wiki/index.ContentSchema) |

#### Returns

`void`

#### Defined in

public/lib/views/ContentForm/ContentForm.types.tsx:75

___

### updateContentMeta

▸ **updateContentMeta**(`e`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `e` | `ContentMeta` |

#### Returns

`void`

#### Defined in

public/lib/views/ContentForm/ContentForm.types.tsx:76
