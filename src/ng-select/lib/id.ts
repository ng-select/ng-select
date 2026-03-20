export function newId() {
	// First character is an 'a', it's good practice to tag id to begin with a letter
	return 'axxxxxxxxxxx'.replace(/[x]/g, () => {
		const val = (Math.random() * 16) | 0;
		return val.toString(16);
	});
}
