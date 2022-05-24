# Interface: CompartmentProps<M, S\>

[index](../wiki/index).CompartmentProps

## Type parameters

| Name | Type |
| :------ | :------ |
| `M` | [`ModuleValue`](../wiki/index#modulevalue) |
| `S` | [`ModuleSettings`](../wiki/index.ModuleSettings) \| [`CtTypeSettings`](../wiki/index.%3Cinternal%3E#cttypesettings) \| [`ContentTypeSchema`](../wiki/index.ContentTypeSchema) \| `undefined` |

## Table of contents

### Properties

- [activeLanguage](../wiki/index.CompartmentProps#activelanguage)
- [allowedTransitions](../wiki/index.CompartmentProps#allowedtransitions)
- [contentItem](../wiki/index.CompartmentProps#contentitem)
- [contentType](../wiki/index.CompartmentProps#contenttype)
- [contentValue](../wiki/index.CompartmentProps#contentvalue)
- [isCreating](../wiki/index.CompartmentProps#iscreating)
- [isValid](../wiki/index.CompartmentProps#isvalid)
- [machine](../wiki/index.CompartmentProps#machine)
- [settings](../wiki/index.CompartmentProps#settings)
- [site](../wiki/index.CompartmentProps#site)
- [value](../wiki/index.CompartmentProps#value)
- [workflow](../wiki/index.CompartmentProps#workflow)

### Methods

- [formikRef](../wiki/index.CompartmentProps#formikref)
- [onChange](../wiki/index.CompartmentProps#onchange)
- [updateContent](../wiki/index.CompartmentProps#updatecontent)
- [updateContentMeta](../wiki/index.CompartmentProps#updatecontentmeta)

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

• `Optional` **machine**: `StateMachine`<`StateMachineContext`, `any`, `StateMachineEvent`, {}, `ActionObject`<`StateMachineContext`, `StateMachineEvent`\>\>

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
| `e` | [`ContentMeta`](../wiki/index.%3Cinternal%3E.ContentMeta) |

#### Returns

`void`

#### Defined in

public/lib/views/ContentForm/ContentForm.types.tsx:76
