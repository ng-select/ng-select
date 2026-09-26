/**
 * People shown on the Contributors page (website/src/content/docs/reference/contributors.mdx).
 *
 * `contributors` lists everyone with commits on the default branch since 1 January 2024, as on
 * https://github.com/ng-select/ng-select/graphs/contributors?from=1%2F1%2F2024 (bots excluded), most
 * commits first. Refresh it with:
 *   gh api --paginate "repos/ng-select/ng-select/commits?since=2024-01-01T00:00:00Z&per_page=100" \
 *     --jq '.[] | select(.author != null and .author.type == "User") | .author.login' | sort | uniq -c | sort -rn
 * Avatars come from the GitHub user id, so they keep working if someone renames their account.
 */
export interface Maintainer {
	login: string;
	/** GitHub user id, used for the avatar URL. */
	id: number;
	name: string;
	bio: string;
	website?: string;
}

export interface Contributor {
	login: string;
	id: number;
	name: string;
}

export const avatarUrl = (id: number, size: number): string => `https://avatars.githubusercontent.com/u/${id}?s=${size * 2}&v=4`;

export const maintainers: Maintainer[] = [
	{
		login: 'pavankjadda',
		id: 17564080,
		name: 'Pavan Kumar Jadda',
		bio: 'Pavan is the lead maintainer of ng-select. He is a full stack developer (Java, Angular and React) with 10 years of experience building enterprise Java and web applications.',
		website: 'https://pavankjadda.dev',
	},
	{
		login: 'saibaburaavi',
		id: 107658821,
		name: 'Sai Babu Raavi',
		bio: 'Sai Babu is a core maintainer of ng-select, contributing features, bug fixes, and releases.',
	},
];

export const contributors: Contributor[] = [
	{ login: 'mahipureti', id: 133873219, name: 'Maheswari Pureti' },
	{ login: 'pankajparkar', id: 5320044, name: 'Pankaj Parkar' },
	{ login: 'quentinderoubaix', id: 139884126, name: 'Quentin Deroubaix' },
	{ login: 'pkurcx', id: 11500742, name: 'pkurcx' },
	{ login: 'giusliso', id: 4948641, name: 'Giuseppe Liso' },
	{ login: 'bastienmoulia', id: 686196, name: 'Bastien' },
	{ login: 'xCMSjQuery', id: 323623396, name: 'xCMSjQuery' },
	{ login: 'troehling', id: 38497272, name: 'troehling' },
	{ login: 'tijsmoree', id: 17835465, name: 'Tijs Moree' },
	{ login: 'terencehonles', id: 438813, name: 'Terence Honles' },
	{ login: 'sroucheray', id: 169818, name: 'Stéphane Roucheray' },
	{ login: 'schwastek', id: 31923722, name: 'schwastek' },
	{ login: 'saschaB91', id: 30199786, name: 'Sascha Berger' },
	{ login: 'rmaiersilldorff', id: 73933518, name: 'Robert Maier-Silldorff' },
	{ login: 'oliverguenther', id: 459462, name: 'Oliver Günther' },
	{ login: 'npnsap', id: 143161837, name: 'Nupin' },
	{ login: 'myabc', id: 755, name: 'Alexander Brandon Coles' },
	{ login: 'mnkprs', id: 17406640, name: 'Manos Kaparos' },
	{ login: 'miccehedin', id: 7142622, name: 'miccehedin' },
	{ login: 'lllen', id: 23261377, name: 'Olena Rozhko' },
	{ login: 'kratharth-1999', id: 184492018, name: 'Kratharth Hegde' },
	{ login: 'jpvanhal', id: 250983, name: 'Janne Vanhala' },
	{ login: 'ert78gb', id: 496775, name: 'Róbert Kiss' },
	{ login: 'eloyortiz', id: 2855364, name: 'Eloy Ortiz' },
	{ login: 'dmmishchenko', id: 51910160, name: 'Dmitriy Mishchenko' },
	{ login: 'cmgchess', id: 61736812, name: 'Chathulanka Gamage' },
	{ login: 'cchvuth', id: 43008041, name: 'ChanVuth Chea' },
	{ login: 'bobbyg603', id: 2646053, name: 'Bobby Galli' },
	{ login: 'Shaper9', id: 88580098, name: 'Marko' },
	{ login: 'SHKChan', id: 42442323, name: 'SHKChan' },
	{ login: 'RichardJansma', id: 50184654, name: 'Richard Jansma' },
	{ login: 'Khartir', id: 5592420, name: 'Thomas Gnandt' },
	{ login: 'Eugeno', id: 23382920, name: 'Eugene' },
	{ login: 'Dafnik', id: 16242839, name: 'Dafnik' },
	{ login: 'Chocobozzz', id: 5180488, name: 'Chocobozzz' },
	{ login: 'CazzanigaGianluca', id: 6860582, name: 'CazzanigaGianluca' },
];
