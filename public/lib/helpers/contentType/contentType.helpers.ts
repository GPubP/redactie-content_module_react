import { compose, filter, sort } from 'ramda';

import {
	ContentTypeCompartment,
	ContentTypeFieldSchema,
	ContentTypeSchema,
} from '../../services/contentTypes';

import { DEFAULT_COMPARTMENTS } from './contentType.helpers.const';

const getCompartments = (contentType: ContentTypeSchema): ContentTypeCompartment[] => {
	if (!contentType) {
		return [];
	}
	return contentType.compartments?.length ? contentType.compartments : DEFAULT_COMPARTMENTS;
};

const getFieldsByCompartment = (
	fields: ContentTypeFieldSchema[],
	compartment: ContentTypeCompartment
): ContentTypeFieldSchema[] => {
	if (!Array.isArray(fields) || !compartment) {
		return [];
	}
	return compose<ContentTypeFieldSchema[], ContentTypeFieldSchema[], ContentTypeFieldSchema[]>(
		filter<ContentTypeFieldSchema>(
			field =>
				field.compartment?.uuid === compartment.uuid ||
				(compartment.removable === false && !field.compartment)
		),
		sort<ContentTypeFieldSchema>(
			(fieldA, fieldB) =>
				(fieldA.compartment?.position ?? Number.MAX_VALUE) -
				(fieldB.compartment?.position ?? Number.MAX_VALUE)
		)
	)(fields);
};

const getFieldsByCompartments = (
	fields: ContentTypeFieldSchema[],
	compartments: ContentTypeCompartment[]
): ContentTypeFieldSchema[] => {
	if (!Array.isArray(fields) || !Array.isArray(compartments)) {
		return [];
	}

	return compartments.reduce(
		(acc, compartment) => [...acc, ...getFieldsByCompartment(fields, compartment)],
		[] as ContentTypeFieldSchema[]
	);
};

export default {
	getCompartments,
	getFieldsByCompartments,
	getFieldsByCompartment,
};
