'use client';

import * as React from 'react';
import { useCep } from '../hooks/useCep';
import { useState, useEffect } from 'react';
import { useFormikContext } from 'formik';
import { FormValues } from '../PropertyForm';
import { TextField, Typography } from '@mui/material';

export default function Step3Address() {
    const {
        values: {
            contactInfo: {
                physicalLocation: {
                    address: {
                        postalCode,
                        addressLine,
                        number,
                        addressLine2,
                        neighborhood,
                        cityName,
                        stateProvinceCode,
                    },
                },
            },
        },
        touched,
        errors,
        handleChange,
        handleBlur,
        setFieldValue
    } = useFormikContext<FormValues>();
    const addressTouched = touched?.contactInfo?.physicalLocation?.address
    const postalCodeTouched = addressTouched?.postalCode;
    const addressLineTouched = addressTouched?.addressLine;
    const numberTouched = addressTouched?.number;
    const addressLine2Touched = addressTouched?.addressLine2;
    const neighborhoodTouched = addressTouched?.neighborhood;
    const cityNameTouched = addressTouched?.cityName;
    const stateProvinceCodeTouched = addressTouched?.stateProvinceCode;

    const addressError = errors?.contactInfo?.physicalLocation?.address;
    const postalCodeError = addressError?.postalCode;
    const addressLineError = addressError?.addressLine;
    const numberError = addressError?.number;
    const addressLine2Error = addressError?.addressLine2;
    const neighborhoodError = addressError?.neighborhood;
    const cityNameError = addressError?.cityName;
    const stateProvinceCodeError = addressError?.stateProvinceCode;

    const [shouldFetch, setShouldFetch] = useState(false);
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
                            value={postalCode ?? ''}
                            onChange={handleSearchPostalCode}
                            onBlur={handleBlur}
                            error={postalCodeTouched && !!postalCodeError}
                            helperText={postalCodeTouched && postalCodeError}
                        />
                        {error && <span style={{ color: '#D2261D' }}>Não foi possível encontrar o CEP</span>}
                    </div>
                <TextField
                    required
                    variant='standard'
                    name={`contactInfo.physicalLocation.address.addressLine`}
                    label="Endereço"
                    value={addressLine ?? ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={addressLineTouched && !!addressLineError}
                    helperText={addressLineTouched && addressLineError}
                />
                <TextField
                    variant='standard'
                    name={`contactInfo.physicalLocation.address.number`}
                    placeholder="Número"
                    value={number}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={numberTouched && !!numberError}
                    helperText={numberTouched && numberError}
                    type="number"
                />
                <TextField
                    variant='standard'
                    name={`contactInfo.physicalLocation.address.addressLine2`}
                    label="Complemento"
                    value={addressLine2 ?? ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={addressLine2Touched && !!addressLine2Error}
                    helperText={addressLine2Touched && addressLine2Error}
                    />
                <TextField
                    variant='standard'
                    name={`contactInfo.physicalLocation.address.neighborhood`}
                    label="Complemento"
                    value={neighborhood ?? ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={neighborhoodTouched && !!neighborhoodError}
                    helperText={neighborhoodTouched && neighborhoodError}
                    />
                <TextField
                    required
                    variant='standard'
                    name={`contactInfo.physicalLocation.address.cityName`}
                    label="Cidade"
                    value={cityName ?? ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={cityNameTouched && !!cityNameError}
                    helperText={cityNameTouched && cityNameError}
                />
                <TextField
                    required
                    variant='standard'
                    name={`contactInfo.physicalLocation.address.stateProvinceCode`}
                    label="Estado"
                    value={stateProvinceCode ?? ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={stateProvinceCodeTouched && !!stateProvinceCodeError}
                    helperText={stateProvinceCodeTouched && stateProvinceCodeError}
                />
                </div>
            </>
    )
}