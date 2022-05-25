# Class: ContentQuery

[index](../wiki/index).[<internal>](../wiki/index.%3Cinternal%3E).ContentQuery

## Hierarchy

- `BaseEntityQuery`<[`ContentState`](../wiki/index.%3Cinternal%3E.ContentState)\>

  ↳ **`ContentQuery`**

## Table of contents

### Constructors

- [constructor](../wiki/index.%3Cinternal%3E.ContentQuery#constructor)

### Properties

- [baseContentItem$](../wiki/index.%3Cinternal%3E.ContentQuery#basecontentitem$)
- [baseContentItemFetching$](../wiki/index.%3Cinternal%3E.ContentQuery#basecontentitemfetching$)
- [content$](../wiki/index.%3Cinternal%3E.ContentQuery#content$)
- [contentItem$](../wiki/index.%3Cinternal%3E.ContentQuery#contentitem$)
- [contentItemDraft$](../wiki/index.%3Cinternal%3E.ContentQuery#contentitemdraft$)
- [isPublishing$](../wiki/index.%3Cinternal%3E.ContentQuery#ispublishing$)
- [meta$](../wiki/index.%3Cinternal%3E.ContentQuery#meta$)

## Constructors

### constructor

• **new ContentQuery**(`store`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `store` | `BaseEntityStore`<[`ContentState`](../wiki/index.%3Cinternal%3E.ContentState), [`ContentSchema`](../wiki/index.ContentSchema), `string`\> |
| `options?` | `QueryConfigOptions`<`any`\> |

#### Inherited from

BaseEntityQuery<ContentState\>.constructor

#### Defined in

node_modules/@redactie/utils/dist/store/baseEntity/baseEntity.query.d.ts:7

## Properties

### baseContentItem$

• **baseContentItem$**: `Observable`<`undefined` \| [`ContentSchema`](../wiki/index.ContentSchema)\>

#### Defined in

public/lib/store/content/content.query.ts:13

___

### baseContentItemFetching$

• **baseContentItemFetching$**: `Observable`<`LoadingState`\>

#### Defined in

public/lib/store/content/content.query.ts:16

___

### content$

• **content$**: `Observable`<[`ContentSchema`](../wiki/index.ContentSchema)[]\>

#### Defined in

public/lib/store/content/content.query.ts:12

___

### contentItem$

• **contentItem$**: `Observable`<`undefined` \| [`ContentSchema`](../wiki/index.ContentSchema)\>

#### Defined in

public/lib/store/content/content.query.ts:20

___

### contentItemDraft$

• **contentItemDraft$**: `Observable`<`undefined` \| [`ContentSchema`](../wiki/index.ContentSchema)\>

#### Defined in

public/lib/store/content/content.query.ts:23

___

### isPublishing$

• **isPublishing$**: `Observable`<`LoadingState`\>

#### Defined in

public/lib/store/content/content.query.ts:26

___

### meta$

• **meta$**: `Observable`<`undefined` \| [`PagingSchema`](../wiki/index.%3Cinternal%3E.PagingSchema)\>

#### Defined in

public/lib/store/content/content.query.ts:9
