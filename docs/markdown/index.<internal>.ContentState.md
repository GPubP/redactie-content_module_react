# Interface: ContentState

[index](../wiki/index).[<internal>](../wiki/index.%3Cinternal%3E).ContentState

## Hierarchy

- `BaseEntityState`<[`ContentModel`](../wiki/index#contentmodel), `string`\>

  ↳ **`ContentState`**

## Table of contents

### Properties

- [baseContentItem](../wiki/index.%3Cinternal%3E.ContentState#basecontentitem)
- [baseContentItemFetching](../wiki/index.%3Cinternal%3E.ContentState#basecontentitemfetching)
- [contentItem](../wiki/index.%3Cinternal%3E.ContentState#contentitem)
- [contentItemDraft](../wiki/index.%3Cinternal%3E.ContentState#contentitemdraft)
- [isPublishing](../wiki/index.%3Cinternal%3E.ContentState#ispublishing)
- [isRemoving](../wiki/index.%3Cinternal%3E.ContentState#isremoving)
- [meta](../wiki/index.%3Cinternal%3E.ContentState#meta)

## Properties

### baseContentItem

• `Optional` **baseContentItem**: [`ContentSchema`](../wiki/index.ContentSchema)

#### Defined in

public/lib/store/content/content.model.ts:10

___

### baseContentItemFetching

• `Optional` **baseContentItemFetching**: `boolean`

#### Defined in

public/lib/store/content/content.model.ts:11

___

### contentItem

• `Optional` **contentItem**: [`ContentSchema`](../wiki/index.ContentSchema)

#### Defined in

public/lib/store/content/content.model.ts:12

___

### contentItemDraft

• `Optional` **contentItemDraft**: [`ContentSchema`](../wiki/index.ContentSchema)

#### Defined in

public/lib/store/content/content.model.ts:13

___

### isPublishing

• **isPublishing**: `boolean`

#### Defined in

public/lib/store/content/content.model.ts:14

___

### isRemoving

• **isRemoving**: `boolean`

#### Overrides

BaseEntityState.isRemoving

#### Defined in

public/lib/store/content/content.model.ts:15

___

### meta

• `Optional` **meta**: [`PagingSchema`](../wiki/index.%3Cinternal%3E.PagingSchema)

#### Defined in

public/lib/store/content/content.model.ts:9
