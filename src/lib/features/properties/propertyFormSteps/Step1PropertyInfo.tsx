import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Field } from "formik";
import { PROPERTY_CATEGORIES } from "../constants/propertyCategories";
import { FieldProps, FormEventProps } from "./types";

type PropertyInfoFields = {
    propertyName: FieldProps;
    propertyCategory: FieldProps;
    propertyOrganization: FieldProps;
};

interface PropertyInfoProps extends FormEventProps {
    props: PropertyInfoFields;
};

export default function Step1PropertyInfo({ props, handleChange, handleBlur }: PropertyInfoProps) {
    const { propertyName, propertyCategory, propertyOrganization } = props;
    return (
        <>
        <TextField
            required
            variant='standard'
            fullWidth
            name="propertyName"
            label="Nome da propriedade"
            value={propertyName.value}
            onChange={handleChange}
            onBlur={handleBlur}
            error={propertyName.touched && !!propertyName.error}
            helperText={propertyName.touched && propertyName.error}
            autoFocus
        />
        <FormControl variant='standard' fullWidth>
            <InputLabel htmlFor='propertyCategory'>Categoria de propriedade</InputLabel>
            <Field
            as={Select}
            id='propertyCategory'
            name="propertyCategory"
            error={propertyCategory.touched && !!propertyCategory.error}
            >
            {Object.values(PROPERTY_CATEGORIES).map((category) => (
                <MenuItem key={category.code} value={category.code}>
                {category.language.pt_BR}
                </MenuItem>
            ))}
            </Field>
        </FormControl>
        <div>
            <p>Você é uma imobiliária ou parte de uma organização ou corporação?</p>
            <TextField
            variant="standard"
            fullWidth
            name="propertyOrganization"
            label="Nome da organização"
            value={propertyOrganization.value}
            onChange={handleChange}
            onBlur={handleBlur}
            error={propertyOrganization.touched && !!propertyOrganization.error}
            helperText={propertyOrganization.touched && propertyOrganization.error}
            />
        </div>
        </>
    );
}