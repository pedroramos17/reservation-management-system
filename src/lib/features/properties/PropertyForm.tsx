'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, SelectChangeEvent } from '@mui/material';
import {
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Typography,
  Select,
  Container,
  MenuItem,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import { Formik, Form, Field, FieldArray, FormikHelpers } from 'formik';
import ArrowBack from '@mui/icons-material/ArrowBack';
import * as Yup from 'yup'
import Anchor from '@/lib/common/components/Anchor';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { getCustomersAsync, selectCustomerById, selectVehiclesByCustomerId } from '../customers/customersSlice';
import { ChargeByType, Customer, Property, Vehicle } from '@/lib/db/idb';
import { getVehiclesAsync } from '../vehicles/vehiclesSlice';
import { addPropertyAsync, selectPropertyById } from './propertySlice';
import { PROPERTY_CATEGORIES } from './constants/propertyCategories';
import { CONTACT_PROFILES } from './constants/contactProfiles';
import { FlexContainer } from '@/lib/common/components/styles/form';
import { Title } from '@/lib/common/components/styles';

interface UrlParams {
  id: string;
};

const step1ValidationSchema = Yup.object({
  propertyId: Yup.string().required('Obrigatório'),
  propertyName: Yup.string().required('Obrigatório'),
  propertyCategory: Yup.string().required('Obrigatório'),
});

const step2ValidationSchema = Yup.object({
  propertyInfo: Yup.object({
    coordinates: Yup.array().of(Yup.number()).min(2).max(2).required('Obrigatório'),
    checkInFrom: Yup.string().required('Obrigatório'),
    checkOutTo: Yup.string().required('Obrigatório'),
    services: Yup.array().of(Yup.string()),
  }),
});

const step3ValidationSchema = Yup.object({
  contactInfo: Yup.array().of(
    Yup.object({
      contactProfileType: Yup.string().required('Obrigatório'),
      name: Yup.string().required('Obrigatório'),
      email: Yup.array().of(Yup.string().email('Email inválido')).min(1, 'Ao menos um email é preciso'),
      phone: Yup.array().of(Yup.number()).min(1, 'Ao menos um número de celular é preciso'),
      address: Yup.object({
        countryCode: Yup.string().required('Obrigatório'),
        addressLine: Yup.string().required('Obrigatório'),
        number: Yup.number(),
        cityName: Yup.string().required('Obrigatório'),
        stateProvinceCode: Yup.string().required('Obrigatório'),
        postalCode: Yup.number().required('Obrigatório'),
      }),
    })
  ).min(1, 'Ao menos um informação de contato é preciso'),
});

export default function PropertyForm(props: Readonly<UrlParams>) {
  const { id } = props;
  const [activeStep, setActiveStep] = useState(0);
  const router = useRouter()
  const dispatch = useAppDispatch();
  const initialValues: Property = {
    propertyId: '',
    propertyName: '',
    propertyCategory: 5,
    propertyInfo: {
      coordinates: [0, 0],
      checkInFrom: '06:00',
      checkOutTo: '23:00',
      services: [],
    },
    contactInfo: [{
      contactProfileType: 'physicalLocation',
      name: '',
      email: [''],
      phone: [0],
      address: {
        countryCode: '',
        addressLine: '',
        number: undefined,
        cityName: '',
        stateProvinceCode: '',
        postalCode: 0,
        updatedAt: null,
      },
      updatedAt: null,
    }],
    updatedAt: null,
}

  const [formData, setFormData] = useState<Property>(initialValues);
  useEffect(() => {
    dispatch(getCustomersAsync());
    dispatch(getVehiclesAsync());
  }, [dispatch]);
  const [chargeByOption, setChargeByOption] = useState('');

  const handleChangeChargeBySelect = (event: SelectChangeEvent) => {
    setChargeByOption(event.target.value as string);
  };
//   const property = useAppSelector(state => selectPropertyById(state, id));
//   const customer = useAppSelector(state => selectCustomerById(state, id));
//   const customerVehicles: Vehicle[] = useAppSelector(state => selectVehiclesByCustomerId(state, customer.id));

//   function parseNumberOrNullToString(value: number | null) {
//     return value ? String(value) : "";
//   }
// const handleFillForm = useCallback(() => {
//   if (customer) {
//     // get customer and vehicles info
//     const { name, email, taxpayerRegistration, phone } = customer;
//     const vehicles = customerVehicles.map(vehicle => ({ id: vehicle.id, brand: vehicle.brand, model: vehicle.model, year: parseNumberOrNullToString(vehicle.year), color: vehicle.color, variant: vehicle.variant, licensePlate: vehicle.licensePlate })); 
//     setFormData({ name, email, taxpayerRegistration: parseNumberOrNullToString(taxpayerRegistration), phone: parseNumberOrNullToString(phone), vehicles });  
//   }
// }, [customerVehicles, customer]);

// useEffect(() => {
//   if (id) {
//     handleFillForm();
//   }
// }, [handleFillForm, id]);


const steps = ['Informações da propriedade', 'Detalhes da  propriedade', 'Informação de contato'];

const handleNext = () => {
  setActiveStep((prevActiveStep) => prevActiveStep + 1);
};

const handleBack = () => {
  setActiveStep((prevActiveStep) => prevActiveStep - 1);
};

const currentValidationSchema = [
  step1ValidationSchema,
  step2ValidationSchema,
  step3ValidationSchema,
][activeStep];
  const handleSubmit = (values: Property, { setSubmitting }: FormikHelpers<Property>) => {
    // if (id) {
    //   updateProperty(values, id);
    // } else {
      const newProperty: Property = {
        propertyId: values.propertyId,
        propertyName: values.propertyName,
        propertyCategory: values.propertyCategory,
        propertyInfo: {
          coordinates: values.propertyInfo.coordinates,
          checkInFrom: values.propertyInfo.checkInFrom,
          checkOutTo: values.propertyInfo.checkOutTo,
          services: values.propertyInfo.services,
        },
        contactInfo: values.contactInfo.map((contactInfo) => {
          return {
            contactProfileType: contactInfo.contactProfileType,
            name: contactInfo.name,
            email: contactInfo.email,
            phone: contactInfo.phone,
            address: {
              countryCode: contactInfo.address.countryCode,
              addressLine: contactInfo.address.addressLine,
              number: contactInfo.address?.number,
              cityName: contactInfo.address.cityName,
              stateProvinceCode: contactInfo.address.stateProvinceCode,
              postalCode: contactInfo.address.postalCode,
              updatedAt: contactInfo.address.updatedAt,
            },
            updatedAt: contactInfo.updatedAt,
          }}),
        updatedAt: values.updatedAt,
      }
      dispatch(addPropertyAsync(newProperty));
    // }
    setSubmitting(false);
    router.push('/propriedades');
  }

  return (
    <div style={{ height: '100vh' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: '16px' }}>
        <Anchor href="/propriedades">
          <ArrowBack sx={{ fontSize: 36, color: '#000' }} />
        </Anchor>
        <Title>{id ? "Editar" : "Cadastrar"} propriedade</Title>
      </Box>
      <Box sx={{ mx: 4 }}>
        <Container maxWidth="md">
          <Formik
            initialValues={initialValues}
            validationSchema={currentValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched }) => (
              <Form noValidate style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', display: 'grid', gap: '24px'}}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {activeStep === 0 && (
                  <>
                    <Field
                      as={TextField}
                      fullWidth
                      name="propertyName"
                      label="Nome da propriedade"
                      error={touched.propertyName && !!errors.propertyName}
                      helperText={touched.propertyName && errors.propertyName}
                    />
                    <FormControl fullWidth>
                      <InputLabel>Categoria de propriedade</InputLabel>
                      <Field
                        as={Select}
                        name="propertyCategory"
                        error={touched.propertyCategory && !!errors.propertyCategory}
                      >
                        {Object.values(PROPERTY_CATEGORIES).map((category) => (
                          <MenuItem key={category.code} value={category.code}>
                            {category.language.pt_BR}
                          </MenuItem>
                        ))}
                      </Field>
                    </FormControl>
                  </>
                )}

                {activeStep === 1 && (
                  <>
                    <FlexContainer>
                      <Field
                        as={TextField}
                        fullWidth
                        name="propertyInfo.coordinates[0]"
                        label="Latitude"
                        type="number"
                        error={touched.propertyInfo?.coordinates && !!errors.propertyInfo?.coordinates}
                        helperText={touched.propertyInfo?.coordinates && errors.propertyInfo?.coordinates}
                      />
                      <Field
                        as={TextField}
                        fullWidth
                        name="propertyInfo.coordinates[1]"
                        label="Longitude"
                        type="number"
                        error={touched.propertyInfo?.coordinates && !!errors.propertyInfo?.coordinates}
                        helperText={touched.propertyInfo?.coordinates && errors.propertyInfo?.coordinates}
                      />
                    </FlexContainer>
                    <FlexContainer>
                      <Field
                        as={TextField}
                        fullWidth
                        name="propertyInfo.checkInFrom"
                        label="Aberto desde as"
                        type="time"
                        error={touched.propertyInfo?.checkInFrom && !!errors.propertyInfo?.checkInFrom}
                        helperText={touched.propertyInfo?.checkInFrom && errors.propertyInfo?.checkInFrom}
                      />
                      <Field
                        as={TextField}
                        fullWidth
                        name="propertyInfo.checkOutTo"
                        label="Fechado às"
                        type="time"
                        error={touched.propertyInfo?.checkOutTo && !!errors.propertyInfo?.checkOutTo}
                        helperText={touched.propertyInfo?.checkOutTo && errors.propertyInfo?.checkOutTo}
                      />
                    </FlexContainer>
                    <FieldArray name="propertyInfo.services">
                      {({ push, remove }) => (
                        <div>
                          {values.propertyInfo.services.map((service, index) => (
                            <div key={index}>
                              <Field
                                as={TextField}
                                name={`propertyInfo.services.${index}`}
                                label={`Serviço ${index + 1}`}
                              />
                              <Button onClick={() => remove(index)}>Remover</Button>
                            </div>
                          ))}
                          <Button onClick={() => push('')}>Adicionar Serviço</Button>
                        </div>
                      )}
                    </FieldArray>
                  </>
                )}

                {activeStep === 2 && (
                  <FieldArray name="contactInfo">
                    {({ push, remove }) => (
                      <div style={{ display: 'grid', gap: '24px' }}>
                        {values.contactInfo.map((_, index) => (
                          <div key={index}>
                            <Typography variant="h6">Contato {index + 1}</Typography>
                            <FormControl fullWidth>
                              <InputLabel>Tipo de Informação de Contato</InputLabel>
                              <Field
                                as={Select}
                                name={`contactInfo.${index}.contactProfileType`}
                              >
                                {Object.keys(CONTACT_PROFILES).map((type) => (
                                  <MenuItem key={type} value={type}>
                                    {type}
                                  </MenuItem>
                                ))}
                              </Field>
                            </FormControl>
                            <Field
                              as={TextField}
                              fullWidth
                              name={`contactInfo.${index}.name`}
                              label="Nome"
                            />
                            <FieldArray name={`contactInfo.${index}.email`}>
                              {({ push: pushEmail, remove: removeEmail }) => (
                                <div>
                                  {values.contactInfo[index].email.map((_, emailIndex) => (
                                    <div key={emailIndex} style={{ display: 'flex', gap: '8px', textWrap: 'nowrap'}}>
                                      <Field
                                        as={TextField}
                                        fullWidth
                                        name={`contactInfo.${index}.email.${emailIndex}`}
                                        label={`Email ${emailIndex + 1}`}
                                      />
                                      <Button onClick={() => removeEmail(emailIndex)}>Remover Email</Button>
                                    </div>
                                  ))}
                                  <Button onClick={() => pushEmail('')}>Adicionar Email</Button>
                                </div>
                              )}
                            </FieldArray>
                            <FieldArray name={`contactInfo.${index}.phone`}>
                              {({ push: pushPhone, remove: removePhone }) => (
                                <div>
                                  {values.contactInfo[index].phone.map((_, phoneIndex) => (
                                    <div key={phoneIndex} style={{ display: 'flex', gap: '8px', textWrap: 'nowrap'}}>
                                      <Field
                                        as={TextField}
                                        fullWidth
                                        name={`contactInfo.${index}.phone.${phoneIndex}`}
                                        label={`Celular ${phoneIndex + 1}`}
                                        type="number"
                                      />
                                      <Button onClick={() => removePhone(phoneIndex)}>Remover Celular</Button>
                                    </div>
                                  ))}
                                  <Button onClick={() => pushPhone(0)}>Adicionar Celular</Button>
                                </div>
                              )}
                            </FieldArray>
                            <Field
                              as={TextField}
                              fullWidth
                              name={`contactInfo.${index}.address.countryCode`}
                              label="País"
                            />
                            <Field
                              as={TextField}
                              fullWidth
                              name={`contactInfo.${index}.address.addressLine`}
                              label="Endereço"
                            />
                            <Field
                              as={TextField}
                              fullWidth
                              name={`contactInfo.${index}.address.number`}
                              label="Número"
                              type="number"
                            />
                            <Field
                              as={TextField}
                              fullWidth
                              name={`contactInfo.${index}.address.cityName`}
                              label="Cidade"
                            />
                            <Field
                              as={TextField}
                              fullWidth
                              name={`contactInfo.${index}.address.stateProvinceCode`}
                              label="Estado"
                            />
                            <Field
                              as={TextField}
                              fullWidth
                              name={`contactInfo.${index}.address.postalCode`}
                              label="CEP"
                              type="number"
                            />
                            {index !== 0 && <Button onClick={() => remove(index)}>Remover Contato</Button>}
                          </div>
                        ))}
                        <Button onClick={() => push({
                          contactProfileType: 'general',
                          name: '',
                          email: [''],
                          phone: [0],
                          address: {
                            countryCode: '',
                            addressLine: '',
                            number: undefined,
                            cityName: '',
                            stateProvinceCode: '',
                            postalCode: 0,
                            updatedAt: null,
                          },
                          updatedAt: null,
                        })}>Adicionar Contato</Button>
                      </div>
                    )}
                  </FieldArray>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  {activeStep > 0 && (
                    <Button onClick={handleBack}>Voltar</Button>
                  )}
                  {activeStep < steps.length - 1 ? (
                    <Button variant="contained" color="primary" onClick={handleNext}>
                      Próximo
                    </Button>
                  ) : (
                    <Button type="submit" variant="contained" color="primary">
                      Salvar
                    </Button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </Container>
      </Box>
  </div>
  );
}
