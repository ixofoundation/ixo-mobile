import i18n from '../i18n';
import _ from 'underscore';

export interface IRecoverValidationModel {
	username: string;
	password: string;
	confirmPassword: string;
	mnemonic: string;
}

export interface IRegisterValidationModel {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export enum ValidationModelTypes {
	Recover,
	Register
}

// Initialization fields go here

const RegisterFields = { username: '', email: '', password: '', confirmPassword: '' };
const RecoverFields = { username: '', password: '', confirmPassword: '', mnemonic: '' };

export class ValidationHelper {
	private modelType: ValidationModelTypes | undefined;
	private t: i18n.TranslationFunction;
	public fields: IRegisterValidationModel | IRecoverValidationModel;

	constructor(modelType: ValidationModelTypes) {
		this.modelType = modelType;
		this.fields = this.InitializeValidationModel();
		this.t = i18n.getFixedT('');
	}

	// ************ public methods ************

	public InitializeValidationModel(): IRecoverValidationModel | IRegisterValidationModel {
		if (this.modelType === ValidationModelTypes.Recover) {
			const model: IRecoverValidationModel = RecoverFields;
			return model;
		}
		if (this.modelType === ValidationModelTypes.Register) {
			const model: IRegisterValidationModel = RegisterFields;
			return model;
		}
	}

	public GetRecoverModel(): IRecoverValidationModel {
		return this.fields as IRecoverValidationModel;
	}

	public GetRegisterModel(): IRegisterValidationModel {
		return this.fields as IRegisterValidationModel;
	}

	public ValidateFields(model: IRecoverValidationModel | IRegisterValidationModel) {
		let validationErrorsModel = this.InitializeValidationModel();
		validationErrorsModel = this.validateMissingFields(model, validationErrorsModel, this.t('register:missingFields'));
		validationErrorsModel = this.validatePasswordFields(model, validationErrorsModel, this.t('register:missmatchPassword'));
		validationErrorsModel = this.validatePasswordLength(model, validationErrorsModel, this.t('register:passwordShort'));
		return { errorModel: validationErrorsModel, errorsFound: !_.isEqual(this.InitializeValidationModel(), validationErrorsModel) };
	}

	// ************ private methods ************

	private validateMissingFields(
		model: IRecoverValidationModel | IRegisterValidationModel,
		fieldErrors: IRecoverValidationModel | IRegisterValidationModel,
		error: string
	) {

		if (model as IRecoverValidationModel) {
			const newFieldErrors = { ...fieldErrors };
			Object.keys(model).forEach(key => {
				if (model[key] === '') {
					newFieldErrors[key] = error;
				}
			});
			return Object.assign({}, fieldErrors, newFieldErrors);
		} else if (model as IRegisterValidationModel) {
			const newFieldErrors = { ...fieldErrors };
			Object.keys(model).forEach(key => {
				if (model[key] === '') {
					newFieldErrors[key] = error;
				}
			});
			return Object.assign({}, fieldErrors, newFieldErrors);
		}
	}

	private validatePasswordFields(
		model: IRecoverValidationModel | IRegisterValidationModel,
		fieldErrors: IRecoverValidationModel | IRegisterValidationModel,
		error: string
	) {
		let newFieldErrors = { ...fieldErrors };
		if (model.password !== model.confirmPassword) {
			newFieldErrors = { ...newFieldErrors, confirmPassword: error };
		}
		return Object.assign({}, fieldErrors, newFieldErrors);
	}

	private validatePasswordLength(
		model: IRecoverValidationModel | IRegisterValidationModel,
		fieldErrors: IRecoverValidationModel | IRegisterValidationModel,
		error: string
	) {
		let newFieldErrors = { ...fieldErrors };
		if (model.password.length < 8) {
			newFieldErrors = { ...newFieldErrors, password: error };
		}
		return Object.assign({}, fieldErrors, newFieldErrors);
	}

	private isRecoverModel(model: IRecoverValidationModel | IRegisterValidationModel): model is IRecoverValidationModel {
		return (model as IRecoverValidationModel).mnemonic !== undefined;
	}

	private isRegisterModel(model: IRecoverValidationModel | IRegisterValidationModel): model is IRecoverValidationModel {
		return (model as IRegisterValidationModel).email !== undefined;
	}
}
