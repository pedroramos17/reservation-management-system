import { FlexContainer } from "@/lib/common/components/styles/form";
import { TextField } from "@mui/material";
import { Field, useFormikContext } from "formik";
import { FormValues } from "../PropertyForm";

export default function Step2HouseRules() {
    const { values: { propertyInfo: {checkInFrom, checkOutTo}}, touched, errors, handleChange, handleBlur } = useFormikContext<FormValues>();
    return (
        <>
            <p>Horário de funcionamento</p>
            <FlexContainer>
                <Field
                as={TextField}
                fullWidth
                name="propertyInfo.checkInFrom"
                label="Aberto desde as"
                type="time"
                value={checkInFrom}
                handleChange={handleChange}
                handleBlur={handleBlur}
                error={touched.propertyInfo?.checkInFrom && !!errors.propertyInfo?.checkInFrom}
                helperText={touched.propertyInfo?.checkInFrom && errors.propertyInfo?.checkInFrom}
                />
                <Field
                as={TextField}
                fullWidth
                name="propertyInfo.checkOutTo"
                label="Fechado às"
                type="time"
                value={checkOutTo}
                handleChange={handleChange}
                handleBlur={handleBlur}
                error={touched.propertyInfo?.checkOutTo && !!errors.propertyInfo?.checkOutTo}
                helperText={touched.propertyInfo?.checkOutTo && errors.propertyInfo?.checkOutTo}
                />
            </FlexContainer>
            </>
    )
}