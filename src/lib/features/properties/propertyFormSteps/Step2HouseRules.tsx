import { FlexContainer } from "@/lib/common/components/styles/form";
import { TextField } from "@mui/material";
import { Field } from "formik";
import { FieldProps } from "./types";

type HouseRulesFields = {
    checkInFrom: FieldProps;
    checkOutTo: FieldProps;
};

interface HouseRulesProps {
    props: HouseRulesFields;
}

export default function Step2HouseRules({props}: HouseRulesProps) {
    const { checkInFrom, checkOutTo } = props;
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
                error={checkInFrom.touched && !!checkInFrom.error}
                helperText={checkInFrom.touched && checkInFrom.error}
                />
                <Field
                as={TextField}
                fullWidth
                name="propertyInfo.checkOutTo"
                label="Fechado às"
                type="time"
                error={checkOutTo.touched && !!checkOutTo.error}
                helperText={checkOutTo.touched && checkOutTo.error}
                />
            </FlexContainer>
            </>
    )
}