'use client';

import * as React from 'react';
import { TextField, Typography } from '@mui/material';
import { FieldProps, FormEventProps } from './types';
import { useCep } from '../hooks/useCep';
import { useState } from 'react';
import { FormikErrors } from 'formik';

type AddressFields = {
    postalCode: FieldProps;
    addressLine: FieldProps;
    number: FieldProps;
    addressLine2: FieldProps;
    neighborhood: FieldProps;
    cityName: FieldProps;
    stateProvinceCode: FieldProps;
}

interface AddressProps extends FormEventProps {
    props: AddressFields
    setFieldValue: (field: string, value: React.SetStateAction<any>, shouldValidate?: boolean) => Promise<void | FormikErrors<any>>
}

export default function Step3Address({props, handleChange, handleBlur, setFieldValue}: AddressProps) {
    const { postalCode, addressLine, number, addressLine2, neighborhood, cityName, stateProvinceCode } = props;
    const [shouldFetch, setShouldFetch] = useState(false);
    const [addressData, setAddressData] = useState({
        cep: "",
        logradouro: "",
        complemento: "",
        bairro: "",
        localidade: "",
        uf: "",
      });
    
    const { data, error, loading } = useCep({postalCode: postalCode.value.toString(), shouldFetch });

    const handleSearchPostalCode = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        handleChange(e);
        if (e.target.value.length === 8) {
            setShouldFetch(true);
            
            if (data) {
                setAddressData(data);
                
                setFieldValue('contactInfo.physicalLocation.address.postalCode', addressData.cep );
                setFieldValue('contactInfo.physicalLocation.address.addressLine', addressData.logradouro );
                setFieldValue('contactInfo.physicalLocation.address.addressLine2', addressData.complemento );
                setFieldValue('contactInfo.physicalLocation.address.neighborhood', addressData.bairro );
                setFieldValue('contactInfo.physicalLocation.address.cityName', addressData.localidade );
                setFieldValue('contactInfo.physicalLocation.address.stateProvinceCode', addressData.uf );
                setShouldFetch(false);
            }
            if (error) {
                setShouldFetch(false);
                console.log(error);
            }
        }
    }
    return (
        <>
            <Typography variant="h6">Onde se encontra o estabelecimento?</Typography>
                <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: '1fr 1fr' }}>
                <TextField
                    required
                    name={`contactInfo.physicalLocation.address.postalCode`}
                    label="CEP"
                    onChange={handleSearchPostalCode}
                    onBlur={handleBlur}
                    error={postalCode.touched && !!postalCode.error}
                    helperText={postalCode.touched && postalCode.error}
                    value={postalCode.value ?? ''}
                />
                
                <TextField
                    required
                    name={`contactInfo.physicalLocation.address.addressLine`}
                    label="Endereço"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={addressLine.touched && !!addressLine.error}
                    helperText={addressLine.touched && addressLine.error}
                    value={addressLine.value ?? ''}
                />
                <TextField
                    variant='outlined'
                    name={`contactInfo.physicalLocation.address.number`}
                    placeholder="Número"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={number.touched && !!number.error}
                    helperText={number.touched && number.error}
                    type="number"
                    value={number.value}
                />
                <TextField
                    name={`contactInfo.physicalLocation.address.addressLine2`}
                    label="Complemento"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={addressLine2.touched && !!addressLine2.error}
                    helperText={addressLine2.touched && addressLine2.error}
                    value={addressLine2.value ?? ''}
                />
                <TextField
                    name={`contactInfo.physicalLocation.address.neighborhood`}
                    label="Complemento"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={neighborhood.touched && !!neighborhood.error}
                    helperText={neighborhood.touched && neighborhood.error}
                    value={neighborhood.value ?? ''}
                />
                <TextField
                    required
                    name={`contactInfo.physicalLocation.address.cityName`}
                    label="Cidade"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={cityName.touched && !!cityName.error}
                    helperText={cityName.touched && cityName.error}
                    value={cityName.value ?? ''}
                />
                <TextField
                    required
                    name={`contactInfo.physicalLocation.address.stateProvinceCode`}
                    label="Estado"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={stateProvinceCode.touched && !!stateProvinceCode.error}
                    helperText={stateProvinceCode.touched && stateProvinceCode.error}
                    value={stateProvinceCode.value ?? ''}
                />
                </div>
            </>
    )
}