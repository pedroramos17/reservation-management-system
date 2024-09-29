export type FieldProps = {
	value?: any;
	touched?: boolean;
	error?: string;
};

export interface FormEventProps {
	handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}
