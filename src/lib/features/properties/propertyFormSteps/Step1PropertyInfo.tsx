import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Field, useFormikContext } from "formik";
import { PROPERTY_CATEGORIES } from "../constants/propertyCategories";
import { FormValues } from "../PropertyForm";

export default function Step1PropertyInfo() {
    const { values: { propertyName, propertyCategory, propertyOrganization }, touched, errors, handleChange, handleBlur } = useFormikContext<FormValues>();
    return (
        <>
        <TextField
            required
            variant='standard'
            fullWidth
            name="propertyName"
            label="Nome da propriedade"
            value={propertyName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.propertyName && !!errors.propertyName}
            helperText={touched.propertyName && errors.propertyName}
            autoFocus
        />
        <FormControl variant='standard' fullWidth>
            <InputLabel htmlFor='propertyCategory'>Categoria de propriedade</InputLabel>
            <Field
            as={Select}
            id='propertyCategory'
            name="propertyCategory"
            value={propertyCategory}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.propertyCategory && !!errors.propertyCategory}
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
            value={propertyOrganization}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.propertyOrganization && !!errors.propertyOrganization}
            helperText={touched.propertyOrganization && errors.propertyOrganization}
            />
        </div>
        </>
    );
}