# Module: index

## Table of contents

### Namespaces

- [&lt;internal\&gt;](../wiki/index.%3Cinternal%3E)

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

- [ContentModel](../wiki/index#contentmodel)
- [ContentSelectProps](../wiki/index#contentselectprops)
- [ContentTypeModel](../wiki/index#contenttypemodel)
- [ExternalCompartmentAfterSubmitFn](../wiki/index#externalcompartmentaftersubmitfn)
- [ExternalCompartmentBeforeSubmitFn](../wiki/index#externalcompartmentbeforesubmitfn)
- [ModuleValue](../wiki/index#modulevalue)

### Variables

- [CONTENT\_STATUS\_API\_MAP](../wiki/index#content_status_api_map)
- [ContentInfoTooltip](../wiki/index#contentinfotooltip)
- [contentApiService](../wiki/index#contentapiservice)

## Type aliases

### ContentModel

Ƭ **ContentModel**: [`ContentSchema`](../wiki/index.ContentSchema)

#### Defined in

public/lib/store/content/content.model.ts:6

___

### ContentSelectProps

Ƭ **ContentSelectProps**: `InputFieldProps` & { `fieldHelperProps`: `FieldHelperProps`<`any`\> & { `setInitialValue?`: (`value`: [`ContentSchema`](../wiki/index.ContentSchema)) => `void`  }  }

#### Defined in

public/lib/components/Fields/ContentSelect/ContentSelect.types.ts:6

___

### ContentTypeModel

Ƭ **ContentTypeModel**: [`ContentTypeSchema`](../wiki/index.ContentTypeSchema)

#### Defined in

public/lib/store/contentTypes/contentTypes.model.ts:6

___

### ExternalCompartmentAfterSubmitFn

Ƭ **ExternalCompartmentAfterSubmitFn**<`M`\>: [`ContentCompartmentAfterSubmitFn`](../wiki/index.%3Cinternal%3E#contentcompartmentaftersubmitfn)<`M`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `M` | [`ModuleValue`](../wiki/index#modulevalue) |

#### Defined in

public/lib/store/api/externalCompartments/externalCompartments.model.ts:31

___

### ExternalCompartmentBeforeSubmitFn

Ƭ **ExternalCompartmentBeforeSubmitFn**<`M`\>: [`ContentCompartmentBeforeSubmitFn`](../wiki/index.%3Cinternal%3E#contentcompartmentbeforesubmitfn)<`M`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `M` | [`ModuleValue`](../wiki/index#modulevalue) |

#### Defined in

public/lib/store/api/externalCompartments/externalCompartments.model.ts:28

___

### ModuleValue

Ƭ **ModuleValue**: `any`

#### Defined in

public/lib/store/api/externalCompartments/externalCompartments.model.ts:13

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

• `Const` **ContentInfoTooltip**: `React.FC`<[`ContentInfoTooltipProps`](../wiki/index.%3Cinternal%3E.ContentInfoTooltipProps)\>

#### Defined in

public/lib/components/ContentInfoTooltip/ContentInfoTooltip.tsx:30

___

### contentApiService

• `Const` **contentApiService**: [`ContentApiService`](../wiki/index.%3Cinternal%3E.ContentApiService)

#### Defined in

public/lib/services/content/content.service.ts:80
