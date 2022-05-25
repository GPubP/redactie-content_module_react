# Namespace: <internal\>

[index](../wiki/index).<internal>

## Table of contents

### Enumerations

- [ALERT\_CONTAINER\_IDS](../wiki/index.%3Cinternal%3E.ALERT_CONTAINER_IDS)
- [CompartmentType](../wiki/index.%3Cinternal%3E.CompartmentType)

### Classes

- [ContentApiService](../wiki/index.%3Cinternal%3E.ContentApiService)
- [ContentFacade](../wiki/index.%3Cinternal%3E.ContentFacade)
- [ContentQuery](../wiki/index.%3Cinternal%3E.ContentQuery)
- [ContentStore](../wiki/index.%3Cinternal%3E.ContentStore)

### Interfaces

- [ContentCompartmentModel](../wiki/index.%3Cinternal%3E.ContentCompartmentModel)
- [ContentCompartmentsValidateOptions](../wiki/index.%3Cinternal%3E.ContentCompartmentsValidateOptions)
- [ContentCreateSchema](../wiki/index.%3Cinternal%3E.ContentCreateSchema)
- [ContentHistorySummary](../wiki/index.%3Cinternal%3E.ContentHistorySummary)
- [ContentHistorySummaryStatus](../wiki/index.%3Cinternal%3E.ContentHistorySummaryStatus)
- [ContentInfoTooltipProps](../wiki/index.%3Cinternal%3E.ContentInfoTooltipProps)
- [ContentMeta](../wiki/index.%3Cinternal%3E.ContentMeta)
- [ContentState](../wiki/index.%3Cinternal%3E.ContentState)
- [ContentTypeCompartment](../wiki/index.%3Cinternal%3E.ContentTypeCompartment)
- [ContentTypeFieldCompartmentRef](../wiki/index.%3Cinternal%3E.ContentTypeFieldCompartmentRef)
- [ContentUpdateSchema](../wiki/index.%3Cinternal%3E.ContentUpdateSchema)
- [ContentsSchema](../wiki/index.%3Cinternal%3E.ContentsSchema)
- [DataType](../wiki/index.%3Cinternal%3E.DataType)
- [ErrorMessagesSchema](../wiki/index.%3Cinternal%3E.ErrorMessagesSchema)
- [ExternalTabValue](../wiki/index.%3Cinternal%3E.ExternalTabValue)
- [FieldType](../wiki/index.%3Cinternal%3E.FieldType)
- [GeneralConfig](../wiki/index.%3Cinternal%3E.GeneralConfig)
- [MapValueToContentItemPath](../wiki/index.%3Cinternal%3E.MapValueToContentItemPath)
- [ModuleSettings](../wiki/index.%3Cinternal%3E.ModuleSettings)
- [PagingSchema](../wiki/index.%3Cinternal%3E.PagingSchema)
- [ResponseError](../wiki/index.%3Cinternal%3E.ResponseError)
- [ValidateSchema](../wiki/index.%3Cinternal%3E.ValidateSchema)
- [ValidateSlugPayload](../wiki/index.%3Cinternal%3E.ValidateSlugPayload)

### Type aliases

- [ContentCompartmentAfterSubmitFn](../wiki/index.%3Cinternal%3E#contentcompartmentaftersubmitfn)
- [ContentCompartmentBeforeSubmitFn](../wiki/index.%3Cinternal%3E#contentcompartmentbeforesubmitfn)
- [ContentStatusKeys](../wiki/index.%3Cinternal%3E#contentstatuskeys)
- [CtTypeSettings](../wiki/index.%3Cinternal%3E#cttypesettings)
- [ExternalStandaloneTabValue](../wiki/index.%3Cinternal%3E#externalstandalonetabvalue)
- [ModuleValue](../wiki/index.%3Cinternal%3E#modulevalue)
- [ModuleValue](../wiki/index.%3Cinternal%3E#modulevalue)
- [ValidationSchema](../wiki/index.%3Cinternal%3E#validationschema)

## Type aliases

### ContentCompartmentAfterSubmitFn

Ƭ **ContentCompartmentAfterSubmitFn**<`M`\>: (`error`: `Error` \| [`ResponseError`](../wiki/index.%3Cinternal%3E.ResponseError) \| `undefined`, `contentItemDraft`: [`ContentSchema`](../wiki/index.ContentSchema), `contentType`: [`ContentTypeSchema`](../wiki/index.ContentTypeSchema), `contentItem`: [`ContentSchema`](../wiki/index.ContentSchema) \| `undefined`, `site?`: `SiteDetailModel`) => `Promise`<`M` \| `void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `M` | [`ModuleValue`](../wiki/index.%3Cinternal%3E#modulevalue) |

#### Type declaration

▸ (`error`, `contentItemDraft`, `contentType`, `contentItem`, `site?`): `Promise`<`M` \| `void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `Error` \| [`ResponseError`](../wiki/index.%3Cinternal%3E.ResponseError) \| `undefined` |
| `contentItemDraft` | [`ContentSchema`](../wiki/index.ContentSchema) |
| `contentType` | [`ContentTypeSchema`](../wiki/index.ContentTypeSchema) |
| `contentItem` | [`ContentSchema`](../wiki/index.ContentSchema) \| `undefined` |
| `site?` | `SiteDetailModel` |

##### Returns

`Promise`<`M` \| `void`\>

#### Defined in

public/lib/store/ui/contentCompartments/contentCompartments.model.ts:30

___

### ContentCompartmentBeforeSubmitFn

Ƭ **ContentCompartmentBeforeSubmitFn**<`M`\>: (`contentItemDraft`: [`ContentSchema`](../wiki/index.ContentSchema), `contentType`: [`ContentTypeSchema`](../wiki/index.ContentTypeSchema), `contentItem`: [`ContentSchema`](../wiki/index.ContentSchema) \| `undefined`, `site?`: `SiteDetailModel`) => `Promise`<`M` \| `void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `M` | [`ModuleValue`](../wiki/index.%3Cinternal%3E#modulevalue) |

#### Type declaration

▸ (`contentItemDraft`, `contentType`, `contentItem`, `site?`): `Promise`<`M` \| `void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `contentItemDraft` | [`ContentSchema`](../wiki/index.ContentSchema) |
| `contentType` | [`ContentTypeSchema`](../wiki/index.ContentTypeSchema) |
| `contentItem` | [`ContentSchema`](../wiki/index.ContentSchema) \| `undefined` |
| `site?` | `SiteDetailModel` |

##### Returns

`Promise`<`M` \| `void`\>

#### Defined in

public/lib/store/ui/contentCompartments/contentCompartments.model.ts:19

___

### ContentStatusKeys

Ƭ **ContentStatusKeys**: [`DRAFT`](../wiki/index.ContentStatus#draft) \| [`SCHEDULED`](../wiki/index.ContentStatus#scheduled) \| [`PENDING_PUBLISH`](../wiki/index.ContentStatus#pending_publish) \| [`PENDING_REVIEW`](../wiki/index.ContentStatus#pending_review) \| [`PUBLISHED`](../wiki/index.ContentStatus#published) \| [`UNPUBLISHED`](../wiki/index.ContentStatus#unpublished)

#### Defined in

public/lib/services/content/content.service.types.ts:132

___

### CtTypeSettings

Ƭ **CtTypeSettings**: `Pick`<[`ContentTypeSchema`](../wiki/index.ContentTypeSchema), ``"valueSyncMap"`` \| ``"fields"`` \| ``"validateSchema"`` \| ``"errorMessages"``\> & { `includeWorkingTitle`: `boolean`  }

#### Defined in

public/lib/views/ContentForm/ContentForm.types.tsx:57

___

### ExternalStandaloneTabValue

Ƭ **ExternalStandaloneTabValue**: `Record`<`string`, `unknown`\>

#### Defined in

public/lib/views/ContentDetailExternal/ContentDetailExternal.types.ts:11

___

### ModuleValue

Ƭ **ModuleValue**: `Record`<`string`, `any`\>

#### Defined in

public/lib/services/content/content.service.types.ts:4

___

### ModuleValue

Ƭ **ModuleValue**: `any`

#### Defined in

public/lib/store/ui/contentCompartments/contentCompartments.model.ts:8

___

### ValidationSchema

Ƭ **ValidationSchema**: `Record`<`string`, `any`\>

#### Defined in

public/lib/services/content/content.service.types.ts:146
