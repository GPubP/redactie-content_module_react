# Class: ContentStore

[index](../wiki/index).[<internal>](../wiki/index.%3Cinternal%3E).ContentStore

## Hierarchy

- `BaseEntityStore`<[`ContentState`](../wiki/index.%3Cinternal%3E.ContentState), [`ContentModel`](../wiki/index#contentmodel)\>

  ↳ **`ContentStore`**

## Table of contents

### Constructors

- [constructor](../wiki/index.%3Cinternal%3E.ContentStore#constructor)

### Methods

- [setIsPublishing](../wiki/index.%3Cinternal%3E.ContentStore#setispublishing)
- [setIsRemoving](../wiki/index.%3Cinternal%3E.ContentStore#setisremoving)

## Constructors

### constructor

• **new ContentStore**(`initialState`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `initialState` | `Partial`<[`ContentState`](../wiki/index.%3Cinternal%3E.ContentState)\> |

#### Overrides

BaseEntityStore&lt;ContentState, ContentModel\&gt;.constructor

#### Defined in

public/lib/store/content/content.store.ts:8

## Methods

### setIsPublishing

▸ **setIsPublishing**(`isPublishing?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `isPublishing` | `boolean` | `false` |

#### Returns

`void`

#### Defined in

public/lib/store/content/content.store.ts:12

___

### setIsRemoving

▸ **setIsRemoving**(`isRemoving?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `isRemoving` | `boolean` | `false` |

#### Returns

`void`

#### Overrides

BaseEntityStore.setIsRemoving

#### Defined in

public/lib/store/content/content.store.ts:18
