/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Authorigins = "_authOrigins",
	Externalauths = "_externalAuths",
	Mfas = "_mfas",
	Otps = "_otps",
	Superusers = "_superusers",
	Carriers = "carriers",
	Partners = "partners",
	QuoteRequests = "quote_requests",
	Quotes = "quotes",
	ShippingMethods = "shipping_methods",
	SupportedCountries = "supported_countries",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type IsoAutoDateString = string & { readonly autodate: unique symbol }
export type RecordIdString = string
export type FileNameString = string & { readonly filename: unique symbol }
export type HTMLString = string

type ExpandType<T> = unknown extends T
	? T extends unknown
		? { expand?: unknown }
		: { expand: T }
	: { expand: T }

// System fields
export type BaseSystemFields<T = unknown> = {
	id: RecordIdString
	collectionId: string
	collectionName: Collections
} & ExpandType<T>

export type AuthSystemFields<T = unknown> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthoriginsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated: IsoAutoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated: IsoAutoDateString
}

export type MfasRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	method: string
	recordRef: string
	updated: IsoAutoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated: IsoAutoDateString
}

export type SuperusersRecord = {
	created: IsoAutoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated: IsoAutoDateString
	verified?: boolean
}

export type CarriersRecord = {
	created: IsoAutoDateString
	id: string
	name?: string
	updated: IsoAutoDateString
}

export type PartnersRecord = {
	created: IsoAutoDateString
	id: string
	name?: string
	updated: IsoAutoDateString
}

export type QuoteRequestsRecord = {
	completed?: boolean
	created: IsoAutoDateString
	created_by?: RecordIdString
	declared_value_usd?: number
	delivery_instructions?: string
	destination_country?: RecordIdString
	height_inches?: number
	id: string
	item_image?: FileNameString
	length_inches?: number
	quote_price?: number
	recipient_address_1?: string
	recipient_city?: string
	recipient_first_name?: string
	recipient_last_name?: string
	recipient_phone?: string
	recipient_postal_code?: string
	recipient_state?: string
	referrer?: RecordIdString
	rejected?: boolean
	rejected_reason?: string
	sender_address?: string
	sender_city?: string
	sender_email?: string
	sender_first_name?: string
	sender_last_name?: string
	sender_phone?: string
	sender_state?: string
	sender_zip_code?: string
	updated: IsoAutoDateString
	weight_lbs?: string
	width_inches?: number
}

export type QuotesRecord = {
	created: IsoAutoDateString
	id: string
	notes?: string
	price?: number
	request?: RecordIdString
	updated: IsoAutoDateString
}

export type ShippingMethodsRecord = {
	created: IsoAutoDateString
	id: string
	name?: string
	updated: IsoAutoDateString
}

export type SupportedCountriesRecord = {
	created: IsoAutoDateString
	id: string
	name?: string
	updated: IsoAutoDateString
}

export enum UsersRoleOptions {
	"manager" = "manager",
	"reseller" = "reseller",
}
export type UsersRecord = {
	avatar?: FileNameString
	created: IsoAutoDateString
	email: string
	emailVisibility?: boolean
	id: string
	name?: string
	password: string
	role?: UsersRoleOptions
	tokenKey: string
	updated: IsoAutoDateString
	verified?: boolean
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type CarriersResponse<Texpand = unknown> = Required<CarriersRecord> & BaseSystemFields<Texpand>
export type PartnersResponse<Texpand = unknown> = Required<PartnersRecord> & BaseSystemFields<Texpand>
export type QuoteRequestsResponse<Texpand = unknown> = Required<QuoteRequestsRecord> & BaseSystemFields<Texpand>
export type QuotesResponse<Texpand = unknown> = Required<QuotesRecord> & BaseSystemFields<Texpand>
export type ShippingMethodsResponse<Texpand = unknown> = Required<ShippingMethodsRecord> & BaseSystemFields<Texpand>
export type SupportedCountriesResponse<Texpand = unknown> = Required<SupportedCountriesRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	carriers: CarriersRecord
	partners: PartnersRecord
	quote_requests: QuoteRequestsRecord
	quotes: QuotesRecord
	shipping_methods: ShippingMethodsRecord
	supported_countries: SupportedCountriesRecord
	users: UsersRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	carriers: CarriersResponse
	partners: PartnersResponse
	quote_requests: QuoteRequestsResponse
	quotes: QuotesResponse
	shipping_methods: ShippingMethodsResponse
	supported_countries: SupportedCountriesResponse
	users: UsersResponse
}

// Utility types for create/update operations

type ProcessCreateAndUpdateFields<T> = Omit<{
	// Omit AutoDate fields
	[K in keyof T as Extract<T[K], IsoAutoDateString> extends never ? K : never]: 
		// Convert FileNameString to File
		T[K] extends infer U ? 
			U extends (FileNameString | FileNameString[]) ? 
				U extends any[] ? File[] : File 
			: U
		: never
}, 'id'>

// Create type for Auth collections
export type CreateAuth<T> = {
	id?: RecordIdString
	email: string
	emailVisibility?: boolean
	password: string
	passwordConfirm: string
	verified?: boolean
} & ProcessCreateAndUpdateFields<T>

// Create type for Base collections
export type CreateBase<T> = {
	id?: RecordIdString
} & ProcessCreateAndUpdateFields<T>

// Update type for Auth collections
export type UpdateAuth<T> = Partial<
	Omit<ProcessCreateAndUpdateFields<T>, keyof AuthSystemFields>
> & {
	email?: string
	emailVisibility?: boolean
	oldPassword?: string
	password?: string
	passwordConfirm?: string
	verified?: boolean
}

// Update type for Base collections
export type UpdateBase<T> = Partial<
	Omit<ProcessCreateAndUpdateFields<T>, keyof BaseSystemFields>
>

// Get the correct create type for any collection
export type Create<T extends keyof CollectionResponses> =
	CollectionResponses[T] extends AuthSystemFields
		? CreateAuth<CollectionRecords[T]>
		: CreateBase<CollectionRecords[T]>

// Get the correct update type for any collection
export type Update<T extends keyof CollectionResponses> =
	CollectionResponses[T] extends AuthSystemFields
		? UpdateAuth<CollectionRecords[T]>
		: UpdateBase<CollectionRecords[T]>

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = {
	collection<T extends keyof CollectionResponses>(
		idOrName: T
	): RecordService<CollectionResponses[T]>
} & PocketBase
