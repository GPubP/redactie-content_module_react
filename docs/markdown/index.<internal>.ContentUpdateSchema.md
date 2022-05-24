# Interface: ContentUpdateSchema

[index](../wiki/index).[<internal>](../wiki/index.%3Cinternal%3E).ContentUpdateSchema

## Hierarchy

- `Omit`<[`ContentSchema`](../wiki/index.ContentSchema), ``"meta"``\>

  ↳ **`ContentUpdateSchema`**

## Table of contents

### Properties

- [\_id](../wiki/index.%3Cinternal%3E.ContentUpdateSchema#_id)
- [fields](../wiki/index.%3Cinternal%3E.ContentUpdateSchema#fields)
- [meta](../wiki/index.%3Cinternal%3E.ContentUpdateSchema#meta)
- [modulesData](../wiki/index.%3Cinternal%3E.ContentUpdateSchema#modulesdata)
- [uuid](../wiki/index.%3Cinternal%3E.ContentUpdateSchema#uuid)

## Properties

### \_id

• `Optional` **\_id**: `string`

#### Inherited from

Omit.\_id

#### Defined in

public/lib/services/content/content.service.types.ts:58

___

### fields

• **fields**: `Record`<`string`, `any`\>

#### Inherited from

Omit.fields

#### Defined in

public/lib/services/content/content.service.types.ts:62

___

### meta

• **meta**: `Omit`<[`ContentMeta`](../wiki/index.%3Cinternal%3E.ContentMeta), ``"contentType"``\> & { `contentType`: { `_id`: `string` ; `uuid`: `string`  }  }

#### Defined in

public/lib/services/content/content.service.types.ts:66

___

### modulesData

• `Optional` **modulesData**: `Record`<`string`, [`ModuleValue`](../wiki/index.%3Cinternal%3E#modulevalue)\>

#### Inherited from

Omit.modulesData

#### Defined in

public/lib/services/content/content.service.types.ts:61

___

### uuid

• `Optional` **uuid**: `string`

#### Inherited from

Omit.uuid

#### Defined in

public/lib/services/content/content.service.types.ts:59
