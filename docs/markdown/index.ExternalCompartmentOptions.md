# Interface: ExternalCompartmentOptions<M\>

[index](../wiki/index).ExternalCompartmentOptions

## Type parameters

| Name | Type |
| :------ | :------ |
| `M` | [`ModuleValue`](../wiki/index#modulevalue-1) |

## Table of contents

### Properties

- [afterSubmit](../wiki/index.ExternalCompartmentOptions#aftersubmit-1)
- [beforeSubmit](../wiki/index.ExternalCompartmentOptions#beforesubmit-1)
- [component](../wiki/index.ExternalCompartmentOptions#component-1)
- [isValid](../wiki/index.ExternalCompartmentOptions#isvalid-1)
- [label](../wiki/index.ExternalCompartmentOptions#label-1)
- [module](../wiki/index.ExternalCompartmentOptions#module-1)
- [replace](../wiki/index.ExternalCompartmentOptions#replace-1)

### Methods

- [getDescription](../wiki/index.ExternalCompartmentOptions#getdescription-1)
- [show](../wiki/index.ExternalCompartmentOptions#show-1)
- [validate](../wiki/index.ExternalCompartmentOptions#validate-1)

## Properties

### afterSubmit

• `Optional` **afterSubmit**: [`ExternalCompartmentAfterSubmitFn`](../wiki/index#externalcompartmentaftersubmitfn-1)<`M`\>

#### Defined in

public/lib/store/api/externalCompartments/externalCompartments.model.ts:40

___

### beforeSubmit

• `Optional` **beforeSubmit**: [`ExternalCompartmentBeforeSubmitFn`](../wiki/index#externalcompartmentbeforesubmitfn-1)<`M`\>

#### Defined in

public/lib/store/api/externalCompartments/externalCompartments.model.ts:39

___

### component

• **component**: `FC`<[`CompartmentProps`](../wiki/index.CompartmentProps)<`M`, `undefined` \| [`ContentTypeSchema`](../wiki/index.ContentTypeSchema) \| [`ModuleSettings`](../wiki/index.ModuleSettings) \| `CtTypeSettings`\>\>

#### Defined in

public/lib/store/api/externalCompartments/externalCompartments.model.ts:36

___

### isValid

• `Optional` **isValid**: `boolean`

#### Defined in

public/lib/store/api/externalCompartments/externalCompartments.model.ts:37

___

### label

• **label**: `string`

#### Defined in

public/lib/store/api/externalCompartments/externalCompartments.model.ts:33

___

### module

• **module**: `string`

#### Defined in

public/lib/store/api/externalCompartments/externalCompartments.model.ts:35

___

### replace

• `Optional` **replace**: `boolean`

#### Defined in

public/lib/store/api/externalCompartments/externalCompartments.model.ts:50

## Methods

### getDescription

▸ `Optional` **getDescription**(`contentItem`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `contentItem` | `undefined` \| [`ContentSchema`](../wiki/index.ContentSchema) |

#### Returns

`string`

#### Defined in

public/lib/store/api/externalCompartments/externalCompartments.model.ts:34

___

### show

▸ `Optional` **show**(`context`, `settings`, `value`, `content`, `contentType`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `Object` |
| `context.isCreating` | `boolean` |
| `settings` | [`ModuleSettings`](../wiki/index.ModuleSettings) |
| `value` | `M` |
| `content` | [`ContentSchema`](../wiki/index.ContentSchema) |
| `contentType` | [`ContentTypeSchema`](../wiki/index.ContentTypeSchema) |

#### Returns

`boolean`

#### Defined in

public/lib/store/api/externalCompartments/externalCompartments.model.ts:41

___

### validate

▸ `Optional` **validate**(`values`, `activeCompartment`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | [`ContentSchema`](../wiki/index.ContentSchema) |
| `activeCompartment` | `ContentCompartmentModel`<`any`, `undefined` \| [`ContentTypeSchema`](../wiki/index.ContentTypeSchema) \| [`ModuleSettings`](../wiki/index.ModuleSettings) \| `CtTypeSettings`\> |

#### Returns

`boolean`

#### Defined in

public/lib/store/api/externalCompartments/externalCompartments.model.ts:38
