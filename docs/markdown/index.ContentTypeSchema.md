# Interface: ContentTypeSchema

[index](../wiki/index).ContentTypeSchema

## Table of contents

### Properties

- [\_id](../wiki/index.ContentTypeSchema#_id-1)
- [compartments](../wiki/index.ContentTypeSchema#compartments-1)
- [errorMessages](../wiki/index.ContentTypeSchema#errormessages-1)
- [fields](../wiki/index.ContentTypeSchema#fields-1)
- [meta](../wiki/index.ContentTypeSchema#meta-1)
- [modulesConfig](../wiki/index.ContentTypeSchema#modulesconfig-1)
- [uuid](../wiki/index.ContentTypeSchema#uuid-1)
- [validateSchema](../wiki/index.ContentTypeSchema#validateschema-1)
- [valueSyncMap](../wiki/index.ContentTypeSchema#valuesyncmap-1)

## Properties

### \_id

• **\_id**: `string`

#### Defined in

public/lib/services/contentTypes/contentTypes.service.types.ts:97

___

### compartments

• **compartments**: `ContentTypeCompartment`[]

#### Defined in

public/lib/services/contentTypes/contentTypes.service.types.ts:112

___

### errorMessages

• **errorMessages**: `ErrorMessagesSchema`

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

• `Optional` **modulesConfig**: `ModuleSettings`[]

#### Defined in

public/lib/services/contentTypes/contentTypes.service.types.ts:113

___

### uuid

• **uuid**: `string`

#### Defined in

public/lib/services/contentTypes/contentTypes.service.types.ts:98

___

### validateSchema

• **validateSchema**: `ValidateSchema`

#### Defined in

public/lib/services/contentTypes/contentTypes.service.types.ts:114

___

### valueSyncMap

• **valueSyncMap**: `ValueSyncMap`

#### Defined in

public/lib/services/contentTypes/contentTypes.service.types.ts:110
