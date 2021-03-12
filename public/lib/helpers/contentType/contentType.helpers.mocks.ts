export const compartmentMockOne = {
	uuid: '123',
	label: 'compartmentLabelOne',
	removable: true,
};
export const compartmentMockTwo = {
	uuid: '1234',
	label: 'compartmentLabelTwo',
	removable: true,
};
export const fieldsMock = [
	{
		name: 'field_mockOne_3',
		compartment: {
			uuid: compartmentMockOne.uuid,
			position: 3,
		},
	},
	{
		name: 'field_mockOne_1',
		compartment: {
			uuid: compartmentMockOne.uuid,
			position: 1,
		},
	},
	{
		name: 'field_mockOne_2',
		compartment: {
			uuid: compartmentMockOne.uuid,
			position: 2,
		},
	},
	{
		name: 'field_default_4',
	},
	{
		name: 'field_mockTwo_6',
		compartment: {
			uuid: compartmentMockTwo.uuid,
			position: 2,
		},
	},
	{
		name: 'field_mockTwo_5',
		compartment: {
			uuid: compartmentMockTwo.uuid,
			position: 1,
		},
	},
	{
		name: 'field_default_7',
	},
];
