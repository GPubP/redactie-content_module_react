# Module: index

## Table of contents

### Enumerations

- [ContentStatus](../wiki/index.ContentStatus)

### Interfaces

- [CompartmentProps](../wiki/index.CompartmentProps)
- [ContentAPI](../wiki/index.ContentAPI)
- [ContentSchema](../wiki/index.ContentSchema)
- [ContentTypeFieldSchema](../wiki/index.ContentTypeFieldSchema)
- [ContentTypeSchema](../wiki/index.ContentTypeSchema)
- [ExternalActionOptions](../wiki/index.ExternalActionOptions)
- [ExternalActionProps](../wiki/index.ExternalActionProps)
- [ExternalCompartmentOptions](../wiki/index.ExternalCompartmentOptions)
- [ExternalTabOptions](../wiki/index.ExternalTabOptions)
- [ExternalTabProps](../wiki/index.ExternalTabProps)
- [ModuleSettings](../wiki/index.ModuleSettings)

### Type aliases

- [ContentModel](../wiki/index#contentmodel-1)
- [ContentTypeModel](../wiki/index#contenttypemodel-1)
- [ExternalCompartmentAfterSubmitFn](../wiki/index#externalcompartmentaftersubmitfn-1)
- [ExternalCompartmentBeforeSubmitFn](../wiki/index#externalcompartmentbeforesubmitfn-1)
- [ModuleValue](../wiki/index#modulevalue-1)

### Variables

- [CONTENT\_STATUS\_API\_MAP](../wiki/index#content_status_api_map-1)
- [ContentInfoTooltip](../wiki/index#contentinfotooltip-1)
- [contentApiService](../wiki/index#contentapiservice-1)

## Type aliases

### ContentModel

Ƭ **ContentModel**: [`ContentSchema`](../wiki/index.ContentSchema)

#### Defined in

public/lib/store/content/content.model.ts:6

___

### ContentTypeModel

Ƭ **ContentTypeModel**: [`ContentTypeSchema`](../wiki/index.ContentTypeSchema)

#### Defined in

public/lib/store/contentTypes/contentTypes.model.ts:6

___

### ExternalCompartmentAfterSubmitFn

Ƭ **ExternalCompartmentAfterSubmitFn**<`M`\>: `ContentCompartmentAfterSubmitFn`<`M`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `M` | [`ModuleValue`](../wiki/index#modulevalue-1) |

#### Defined in

public/lib/store/api/externalCompartments/externalCompartments.model.ts:30

___

### ExternalCompartmentBeforeSubmitFn

Ƭ **ExternalCompartmentBeforeSubmitFn**<`M`\>: `ContentCompartmentBeforeSubmitFn`<`M`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `M` | [`ModuleValue`](../wiki/index#modulevalue-1) |

#### Defined in

public/lib/store/api/externalCompartments/externalCompartments.model.ts:27

___

### ModuleValue

Ƭ **ModuleValue**: `any`

#### Defined in

public/lib/store/api/externalCompartments/externalCompartments.model.ts:12

## Variables

### CONTENT\_STATUS\_API\_MAP

• `Const` **CONTENT\_STATUS\_API\_MAP**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `DRAFT` | `string` |
| `NEW` | `string` |
| `PENDING_PUBLISH` | `string` |
| `PENDING_REVIEW` | `string` |
| `PUBLISHED` | `string` |
| `SCHEDULED` | `string` |
| `UNPUBLISHED` | `string` |

#### Defined in

public/lib/services/content/content.service.const.ts:27

___

### ContentInfoTooltip

• `Const` **ContentInfoTooltip**: `React.FC`<`ContentInfoTooltipProps`\>

#### Defined in

public/lib/components/ContentInfoTooltip/ContentInfoTooltip.tsx:22

___

### contentApiService

• `Const` **contentApiService**: `ContentApiService`

#### Defined in

public/lib/services/content/content.service.ts:78
