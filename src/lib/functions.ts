const buildTree = async (rows: any[]): Promise<any[]> => {
	const map: Record<string, any> = {};

	rows.forEach((item) => {
		map[item.user_id] = { ...item, child: [] };
	});

	let root: any[] = [];

	rows.forEach((item) => {
		if (item.parent_id && map[item.parent_id]) {
			map[item.parent_id].child.push(map[item.user_id]);
		} else {
			root.push(map[item.user_id]);
		}
	});

	return root;
};

export { buildTree };
