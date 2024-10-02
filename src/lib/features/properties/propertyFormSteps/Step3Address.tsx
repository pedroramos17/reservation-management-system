'use client';

import * as React from 'react';
import { TextField, Typography } from '@mui/material';
import { FieldProps, FormEventProps } from './types';
import { useCep } from '../hooks/useCep';
import { useState, useEffect } from 'react';
import { useFormikContext } from 'formik';

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
}

export default function Step3Address({props, handleChange, handleBlur}: AddressProps) {
    const { postalCode, addressLine, number, addressLine2, neighborhood, cityName, stateProvinceCode } = props;
    const [shouldFetch, setShouldFetch] = useState(false);
    const { setFieldValue } = useFormikContext();
    const [addressData, setAddressData] = useState({
        cep: "",
        logradouro: "",
        bairro: "",
        localidade: "",
        uf: "",
      });

      const { data, error } = useCep({postalCode: addressData.cep.trim().split('-').join(''), shouldFetch });
      const cepLength = 8;
      
    useEffect(() => {
        let isCurrent = true;
        if (addressData.cep.trim().length !== cepLength) {
            setShouldFetch(false);
        }
        if (addressData.cep.trim().length === cepLength) {
            setShouldFetch(true);
            if (isCurrent) {
            if (data && data?.error !== true) {
                console.log(data);
                const { ibge, ...dataProps} = data;

                setAddressData(Object.assign(addressData,dataProps));

                setFieldValue('contactInfo.physicalLocation.address.postalCode', addressData.cep );
                setFieldValue('contactInfo.physicalLocation.address.addressLine', addressData.logradouro );
                setFieldValue('contactInfo.physicalLocation.address.neighborhood', addressData.bairro );
                setFieldValue('contactInfo.physicalLocation.address.cityName', addressData.localidade );
                setFieldValue('contactInfo.physicalLocation.address.stateProvinceCode', addressData.uf );
                setShouldFetch(false);
            }
        }
        }
        return () => {
            isCurrent = false;
        };
    }, [addressData, data, setFieldValue, setShouldFetch, cepLength]);

    const handleSearchPostalCode = (e: React.ChangeEvent<HTMLInputElement>) => {
        const cep = e.target.value;
        setAddressData((prevData) => {
            return {
                ...prevData,
                cep
            }
        })
        handleChange(e);
    }

    return (
        <>
            <Typography variant="h6">Onde se encontra o estabelecimento?</Typography>
                <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: '1fr 1fr' }}>
                    <div>
                        <TextField
                            required
                            fullWidth
                            variant='standard'
                            name={`contactInfo.physicalLocation.address.postalCode`}
                            label="CEP"
                            value={postalCode.value ?? ''}
                            onChange={handleSearchPostalCode}
                            onBlur={handleBlur}
                            error={postalCode.touched && !!postalCode.error}
                            helperText={postalCode.touched && postalCode.error}
                        />
                        {error && <span style={{ color: '#D2261D' }}>Não foi possível encontrar o CEP</span>}
                    </div>
                <TextField
                    required
                    variant='standard'
                    name={`contactInfo.physicalLocation.address.addressLine`}
                    label="Endereço"
                    value={addressLine.value ?? ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={addressLine.touched && !!addressLine.error}
                    helperText={addressLine.touched && addressLine.error}
                />
                <TextField
                    variant='standard'
                    name={`contactInfo.physicalLocation.address.number`}
                    placeholder="Número"
                    value={number.value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={number.touched && !!number.error}
                    helperText={number.touched && number.error}
                    type="number"
                />
                <TextField
                    variant='standard'
                    name={`contactInfo.physicalLocation.address.addressLine2`}
                    label="Complemento"
                    value={addressLine2.value ?? ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={addressLine2.touched && !!addressLine2.error}
                    helperText={addressLine2.touched && addressLine2.error}
                    />
                <TextField
                    variant='standard'
                    name={`contactInfo.physicalLocation.address.neighborhood`}
                    label="Complemento"
                    value={neighborhood.value ?? ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={neighborhood.touched && !!neighborhood.error}
                    helperText={neighborhood.touched && neighborhood.error}
                    />
                <TextField
                    required
                    variant='standard'
                    name={`contactInfo.physicalLocation.address.cityName`}
                    label="Cidade"
                    value={cityName.value ?? ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={cityName.touched && !!cityName.error}
                    helperText={cityName.touched && cityName.error}
                />
                <TextField
                    required
                    variant='standard'
                    name={`contactInfo.physicalLocation.address.stateProvinceCode`}
                    label="Estado"
                    value={stateProvinceCode.value ?? ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={stateProvinceCode.touched && !!stateProvinceCode.error}
                    helperText={stateProvinceCode.touched && stateProvinceCode.error}
                />
                </div>
            </>
    )
}