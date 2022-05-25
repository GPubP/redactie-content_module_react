# Interface: ContentMeta

[index](../wiki/index).[<internal>](../wiki/index.%3Cinternal%3E).ContentMeta

## Table of contents

### Properties

- [activeLanguages](../wiki/index.%3Cinternal%3E.ContentMeta#activelanguages)
- [contentType](../wiki/index.%3Cinternal%3E.ContentMeta#contenttype)
- [created](../wiki/index.%3Cinternal%3E.ContentMeta#created)
- [description](../wiki/index.%3Cinternal%3E.ContentMeta#description)
- [firstPublished](../wiki/index.%3Cinternal%3E.ContentMeta#firstpublished)
- [historySummary](../wiki/index.%3Cinternal%3E.ContentMeta#historysummary)
- [label](../wiki/index.%3Cinternal%3E.ContentMeta#label)
- [lang](../wiki/index.%3Cinternal%3E.ContentMeta#lang)
- [lastEditor](../wiki/index.%3Cinternal%3E.ContentMeta#lasteditor)
- [lastModified](../wiki/index.%3Cinternal%3E.ContentMeta#lastmodified)
- [publishTime](../wiki/index.%3Cinternal%3E.ContentMeta#publishtime)
- [published](../wiki/index.%3Cinternal%3E.ContentMeta#published)
- [site](../wiki/index.%3Cinternal%3E.ContentMeta#site)
- [slug](../wiki/index.%3Cinternal%3E.ContentMeta#slug)
- [status](../wiki/index.%3Cinternal%3E.ContentMeta#status)
- [theme](../wiki/index.%3Cinternal%3E.ContentMeta#theme)
- [translationId](../wiki/index.%3Cinternal%3E.ContentMeta#translationid)
- [unpublishTime](../wiki/index.%3Cinternal%3E.ContentMeta#unpublishtime)
- [urlPath](../wiki/index.%3Cinternal%3E.ContentMeta#urlpath)
- [workflowState](../wiki/index.%3Cinternal%3E.ContentMeta#workflowstate)

## Properties

### activeLanguages

• **activeLanguages**: `string`[]

#### Defined in

public/lib/services/content/content.service.types.ts:42

___

### contentType

• **contentType**: [`ContentTypeSchema`](../wiki/index.ContentTypeSchema)

#### Defined in

public/lib/services/content/content.service.types.ts:29

___

### created

• `Optional` **created**: `string`

#### Defined in

public/lib/services/content/content.service.types.ts:40

___

### description

• `Optional` **description**: `string`

#### Defined in

public/lib/services/content/content.service.types.ts:28

___

### firstPublished

• `Optional` **firstPublished**: `string`

#### Defined in

public/lib/services/content/content.service.types.ts:43

___

### historySummary

• `Optional` **historySummary**: [`ContentHistorySummary`](../wiki/index.%3Cinternal%3E.ContentHistorySummary)

#### Defined in

public/lib/services/content/content.service.types.ts:30

___

### label

• **label**: `string`

#### Defined in

public/lib/services/content/content.service.types.ts:24

___

### lang

• **lang**: `string`

#### Defined in

public/lib/services/content/content.service.types.ts:27

___

### lastEditor

• `Optional` **lastEditor**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `firstname?` | `string` |
| `lastname?` | `string` |

#### Defined in

public/lib/services/content/content.service.types.ts:33

___

### lastModified

• `Optional` **lastModified**: `string`

#### Defined in

public/lib/services/content/content.service.types.ts:41

___

### publishTime

• `Optional` **publishTime**: ``null`` \| `string`

#### Defined in

public/lib/services/content/content.service.types.ts:44

___

### published

• `Optional` **published**: `boolean`

#### Defined in

public/lib/services/content/content.service.types.ts:39

___

### site

• **site**: `string`

#### Defined in

public/lib/services/content/content.service.types.ts:26

___

### slug

• **slug**: `Record`<`string`, `string`\>

#### Defined in

public/lib/services/content/content.service.types.ts:25

___

### status

• **status**: `string`

#### Defined in

public/lib/services/content/content.service.types.ts:37

___

### theme

• `Optional` **theme**: `string`

#### Defined in

public/lib/services/content/content.service.types.ts:31

___

### translationId

• **translationId**: `string`

#### Defined in

public/lib/services/content/content.service.types.ts:32

___

### unpublishTime

• `Optional` **unpublishTime**: ``null`` \| `string`

#### Defined in

public/lib/services/content/content.service.types.ts:45

___

### urlPath

• `Optional` **urlPath**: `Record`<`string`, { `pattern`: `string` ; `standardPattern`: `string` ; `standardValue`: `string` ; `value`: `string`  }\>

#### Defined in

public/lib/services/content/content.service.types.ts:46

___

### workflowState

• **workflowState**: `string`

#### Defined in

public/lib/services/content/content.service.types.ts:38
