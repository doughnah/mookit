{
	modules: [
		{id: 'module_a', title: 'Module A', interact: true},
		{id: 'module_b', title: 'Module B', interact: true},
		{id: 'module_d', title: 'Module D', interact: true},
		{id: 'module_g', title: 'Module G', interact: true}
	],
	
	containers: [
		{
			id: 'container_1',
			modules: [
				{id: 'module_c', title: 'Module C', interact: false},
				{
					id: 'container_3',
					modules: [
						{id: 'module_h', title: 'Module H', interact: true}
					]
				},
				{id: 'module_e', title: 'Module E', interact: true}
			]
		},
		{
			id: 'container_2',
			modules: [
				{id: 'module_f', title: 'Module F', interact: false}
			]
		}
	]
}