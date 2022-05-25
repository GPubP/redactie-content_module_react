# Interface: ContentCompartmentModel<M, S\>

[index](../wiki/index).[<internal>](../wiki/index.%3Cinternal%3E).ContentCompartmentModel

## Type parameters

| Name | Type |
| :------ | :------ |
| `M` | [`ModuleValue`](../wiki/index.%3Cinternal%3E#modulevalue) |
| `S` | [`ModuleSettings`](../wiki/index.ModuleSettings) \| [`CtTypeSettings`](../wiki/index.%3Cinternal%3E#cttypesettings) \| [`ContentTypeSchema`](../wiki/index.ContentTypeSchema) \| `undefined` |

## Table of contents

### Properties

- [afterSubmit](../wiki/index.%3Cinternal%3E.ContentCompartmentModel#aftersubmit)
- [beforeSubmit](../wiki/index.%3Cinternal%3E.ContentCompartmentModel#beforesubmit)
- [component](../wiki/index.%3Cinternal%3E.ContentCompartmentModel#component)
- [context](../wiki/index.%3Cinternal%3E.ContentCompartmentModel#context)
- [isValid](../wiki/index.%3Cinternal%3E.ContentCompartmentModel#isvalid)
- [label](../wiki/index.%3Cinternal%3E.ContentCompartmentModel#label)
- [name](../wiki/index.%3Cinternal%3E.ContentCompartmentModel#name)
- [slug](../wiki/index.%3Cinternal%3E.ContentCompartmentModel#slug)
- [type](../wiki/index.%3Cinternal%3E.ContentCompartmentModel#type)

### Methods

- [getDescription](../wiki/index.%3Cinternal%3E.ContentCompartmentModel#getdescription)
- [validate](../wiki/index.%3Cinternal%3E.ContentCompartmentModel#validate)

## Properties

### afterSubmit

• `Optional` **afterSubmit**: [`ContentCompartmentAfterSubmitFn`](../wiki/index.%3Cinternal%3E#contentcompartmentaftersubmitfn)<`M`\>

#### Defined in

public/lib/store/ui/contentCompartments/contentCompartments.model.ts:61

___

### beforeSubmit

• `Optional` **beforeSubmit**: [`ContentCompartmentBeforeSubmitFn`](../wiki/index.%3Cinternal%3E#contentcompartmentbeforesubmitfn)<`M`\>

#### Defined in

public/lib/store/ui/contentCompartments/contentCompartments.model.ts:60

___

### component

• **component**: `FC`<[`CompartmentProps`](../wiki/index.CompartmentProps)<`M`, `S`\>\>

#### Defined in

public/lib/store/ui/contentCompartments/contentCompartments.model.ts:51

___

### context

• `Optional` **context**: `Record`<`string`, `any`\>

#### Defined in

public/lib/store/ui/contentCompartments/contentCompartments.model.ts:54

___

### isValid

• `Optional` **isValid**: `boolean`

#### Defined in

public/lib/store/ui/contentCompartments/contentCompartments.model.ts:53

___

### label

• **label**: `string`

#### Defined in

public/lib/store/ui/contentCompartments/contentCompartments.model.ts:48

___

### name

• **name**: `string`

#### Defined in

public/lib/store/ui/contentCompartments/contentCompartments.model.ts:47

___

### slug

• `Optional` **slug**: `string`

#### Defined in

public/lib/store/ui/contentCompartments/contentCompartments.model.ts:50

___

### type

• **type**: [`CompartmentType`](../wiki/index.%3Cinternal%3E.CompartmentType)

#### Defined in

public/lib/store/ui/contentCompartments/contentCompartments.model.ts:52

## Methods

### getDescription

▸ `Optional` **getDescription**(`contentItem`): `undefined` \| `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `contentItem` | `undefined` \| [`ContentSchema`](../wiki/index.ContentSchema) |

#### Returns

`undefined` \| `string`

#### Defined in

public/lib/store/ui/contentCompartments/contentCompartments.model.ts:49

___

### validate

▸ `Optional` **validate**(`values`, `activeCompartment`, `options`): `boolean` \| `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | [`ContentSchema`](../wiki/index.ContentSchema) |
| `activeCompartment` | [`ContentCompartmentModel`](../wiki/index.%3Cinternal%3E.ContentCompartmentModel)<`any`, `undefined` \| [`ContentTypeSchema`](../wiki/index.ContentTypeSchema) \| [`ModuleSettings`](../wiki/index.ModuleSettings) \| [`CtTypeSettings`](../wiki/index.%3Cinternal%3E#cttypesettings)\> |
| `options` | [`ContentCompartmentsValidateOptions`](../wiki/index.%3Cinternal%3E.ContentCompartmentsValidateOptions) |

#### Returns

`boolean` \| `Promise`<`boolean`\>

#### Defined in

public/lib/store/ui/contentCompartments/contentCompartments.model.ts:55
