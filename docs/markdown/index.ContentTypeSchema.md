# Interface: ContentTypeSchema

[index](../wiki/index).ContentTypeSchema

## Table of contents

### Properties

- [\_id](../wiki/index.ContentTypeSchema#_id)
- [compartments](../wiki/index.ContentTypeSchema#compartments)
- [errorMessages](../wiki/index.ContentTypeSchema#errormessages)
- [fields](../wiki/index.ContentTypeSchema#fields)
- [meta](../wiki/index.ContentTypeSchema#meta)
- [modulesConfig](../wiki/index.ContentTypeSchema#modulesconfig)
- [uuid](../wiki/index.ContentTypeSchema#uuid)
- [validateSchema](../wiki/index.ContentTypeSchema#validateschema)
- [valueSyncMap](../wiki/index.ContentTypeSchema#valuesyncmap)

## Properties

### \_id

• **\_id**: `string`

#### Defined in

public/lib/services/contentTypes/contentTypes.service.types.ts:97

___

### compartments

• **compartments**: [`ContentTypeCompartment`](../wiki/index.%3Cinternal%3E.ContentTypeCompartment)[]

#### Defined in

public/lib/services/contentTypes/contentTypes.service.types.ts:112

___

### errorMessages

• **errorMessages**: [`ErrorMessagesSchema`](../wiki/index.%3Cinternal%3E.ErrorMessagesSchema)

#### Defined in

public/lib/services/contentTypes/contentTypes.service.types.ts:115

___

### fields

• **fields**: [`ContentTypeFieldSchema`](../wiki/index.ContentTypeFieldSchema)[]

#### Defined in

public/lib/services/contentTypes/contentTypes.service.types.ts:111

___

### meta

• **meta**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `canBeFiltered` | `boolean` |
| `description` | `string` |
| `issuedOnEditable?` | `boolean` |
| `issuedOnPrefill?` | `string` |
| `label` | `string` |
| `status` | `string` |
| `urlPath?` | { `pattern?`: `string`  } |
| `urlPath.pattern?` | `string` |

#### Defined in

public/lib/services/contentTypes/contentTypes.service.types.ts:99

___

### modulesConfig

• `Optional` **modulesConfig**: [`ModuleSettings`](../wiki/index.%3Cinternal%3E.ModuleSettings)[]

#### Defined in

public/lib/services/contentTypes/contentTypes.service.types.ts:113

___

### uuid

• **uuid**: `string`

#### Defined in

public/lib/services/contentTypes/contentTypes.service.types.ts:98

___

### validateSchema

• **validateSchema**: [`ValidateSchema`](../wiki/index.%3Cinternal%3E.ValidateSchema)

#### Defined in

public/lib/services/contentTypes/contentTypes.service.types.ts:114

___

### valueSyncMap

• **valueSyncMap**: `ValueSyncMap`

#### Defined in

public/lib/services/contentTypes/contentTypes.service.types.ts:110
