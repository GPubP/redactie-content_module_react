# Interface: ExternalCompartmentOptions<M\>

[index](../wiki/index).ExternalCompartmentOptions

## Type parameters

| Name | Type |
| :------ | :------ |
| `M` | [`ModuleValue`](../wiki/index#modulevalue) |

## Table of contents

### Properties

- [afterSubmit](../wiki/index.ExternalCompartmentOptions#aftersubmit)
- [beforeSubmit](../wiki/index.ExternalCompartmentOptions#beforesubmit)
- [component](../wiki/index.ExternalCompartmentOptions#component)
- [isValid](../wiki/index.ExternalCompartmentOptions#isvalid)
- [label](../wiki/index.ExternalCompartmentOptions#label)
- [module](../wiki/index.ExternalCompartmentOptions#module)
- [replace](../wiki/index.ExternalCompartmentOptions#replace)

### Methods

- [getDescription](../wiki/index.ExternalCompartmentOptions#getdescription)
- [show](../wiki/index.ExternalCompartmentOptions#show)
- [validate](../wiki/index.ExternalCompartmentOptions#validate)

## Properties

### afterSubmit

• `Optional` **afterSubmit**: [`ExternalCompartmentAfterSubmitFn`](../wiki/index#externalcompartmentaftersubmitfn)<`M`\>

#### Defined in

public/lib/store/api/externalCompartments/externalCompartments.model.ts:41

___

### beforeSubmit

• `Optional` **beforeSubmit**: [`ExternalCompartmentBeforeSubmitFn`](../wiki/index#externalcompartmentbeforesubmitfn)<`M`\>

#### Defined in

public/lib/store/api/externalCompartments/externalCompartments.model.ts:40

___

### component

• **component**: `FC`<[`CompartmentProps`](../wiki/index.CompartmentProps)<`M`, `undefined` \| [`ContentTypeSchema`](../wiki/index.ContentTypeSchema) \| [`ModuleSettings`](../wiki/index.ModuleSettings) \| `CtTypeSettings`\>\>

#### Defined in

public/lib/store/api/externalCompartments/externalCompartments.model.ts:37

___

### isValid

• `Optional` **isValid**: `boolean`

#### Defined in

public/lib/store/api/externalCompartments/externalCompartments.model.ts:38

___

### label

• **label**: `string`

#### Defined in

public/lib/store/api/externalCompartments/externalCompartments.model.ts:34

___

### module

• **module**: `string`

#### Defined in

public/lib/store/api/externalCompartments/externalCompartments.model.ts:36

___

### replace

• `Optional` **replace**: `boolean`

#### Defined in

public/lib/store/api/externalCompartments/externalCompartments.model.ts:52

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

public/lib/store/api/externalCompartments/externalCompartments.model.ts:35

___

### show

▸ `Optional` **show**(`context`, `settings`, `value`, `content`, `contentType`, `site`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `Object` |
| `context.isCreating` | `boolean` |
| `settings` | [`ModuleSettings`](../wiki/index.ModuleSettings) |
| `value` | `M` |
| `content` | [`ContentSchema`](../wiki/index.ContentSchema) |
| `contentType` | [`ContentTypeSchema`](../wiki/index.ContentTypeSchema) |
| `site` | `SiteResponse` |

#### Returns

`boolean`

#### Defined in

public/lib/store/api/externalCompartments/externalCompartments.model.ts:42

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

public/lib/store/api/externalCompartments/externalCompartments.model.ts:39
