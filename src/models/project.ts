export interface IProject {
	data: IData;
	projectDid: string;
	pubKey: string;
	senderDid: string;
	txHash: string;
}
interface IData {
	title: string;
	projectDid: string;
	ownerName: string;
	ownerEmail: string;
	shortDescription: string;
	longDescription: string;
	impactAction: string;
	createdOn: Date;
	createdBy: string;
	projectLocation: string;
	requiredClaims: number;
	sdgs: number[];
	templates: ITemplates;
	evaluatorPayPerClaim: string;
	claimStats: IClaimStats;
	claims: IClaim[];
	agentsStats: IAgentStats;
	agents: IAgent[];
	socialMedia: ISocialMedia;
	ixo: IIxo;
	serviceEndpoint: string;
	imageLink: string;
	founder: IFounder;
}
interface IIxo {
	totalStaked: number;
	totalUsed: number;
}
interface ISocialMedia {
	facebookLink: string;
	instagramLink: string;
	twitterLink: string;
	webLink: string;
}
interface IFounder {
	name: string;
	email: string;
	countryOfOrigin: string;
	shortDescription: string;
	websiteURL: string;
	logoLink: string;
}
interface IClaimStats {
	currentSuccessful: number;
	currentRejected: number;
}
export interface IClaim {
	claimId: string;
	_created: Date;
	date: Date;
	location: ILocation;
	txHash: string;
	status: string;
	saDid: string;
	eaDid?: string;
}
export interface IClaimSaved {
	claimId: string;
	claimData: string;
	date?: Date;
	updated?: boolean;
}

export interface IProjectSaved {
	userHasCapabilities?: boolean;
	projectLocalImageUri?: string;
	projectDid: string;
}

interface ILocation {
	long: string;
	lat: string;
}
interface ITemplates {
	claim: IClaimTemplate;
}
interface IClaimTemplate {
	schema: string;
	form: string;
}
interface IAgentStats {
	evaluators: number;
	evaluatorsPending: number;
	serviceProviders: number;
	serviceProvidersPending: number;
	investors: number;
	investorsPending: number;
}
export interface IAgent {
	did: string;
	status: string;
	kyc?: boolean;
	role: string;
}
