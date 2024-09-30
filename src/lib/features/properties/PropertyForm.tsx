'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Container,
  Stepper,
  Step,
  StepLabel,
  Select,
  MenuItem,
  FormControl,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputAdornment,
  OutlinedInput,
  Radio,
  RadioGroup,
  SelectChangeEvent
} from '@mui/material';
import { Formik, Form, FormikHelpers, getIn } from 'formik';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Anchor from '@/lib/common/components/Anchor';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { getCustomersAsync, selectCustomerById, selectVehiclesByCustomerId } from '../customers/customersSlice';
import { ChargePer, ContactProfileType, Customer, Property, Vehicle } from '@/lib/db/idb';
import { getVehiclesAsync } from '../vehicles/vehiclesSlice';
import { addPropertyAsync, selectPropertyById } from './propertySlice';
import { PROPERTY_CATEGORIES } from './constants/propertyCategories';
import { CONTACT_PROFILES } from './constants/contactProfiles';
import { FlexContainer } from '@/lib/common/components/styles/form';
import { Title } from '@/lib/common/components/styles';
import { step1ValidationSchema, step2ValidationSchema, step3ValidationSchema, step4ValidationSchema, step5ValidationSchema } from './schemas/propertyFormSchema';
import Step1PropertyInfo from './propertyFormSteps/Step1PropertyInfo';
import Step2HouseRules from './propertyFormSteps/Step2HouseRules';
import Step3Address from './propertyFormSteps/Step3Address';

interface UrlParams {
  id: string;
};

interface FormValues {
    propertyId: string;
    propertyName: string;
    propertyOrganization: string;
    propertyCategory: number; // Código da categoria da propriedade, ex: escola, hotel, hospital, etc.
    propertyInfo: {
      coordinates: number[];
      checkInFrom: string;
      checkOutTo: string;
      services: {
        key: string;
        value:
          | string
          | number
          | { key: string; value: string | number }[];
      }[];
    };
    contactInfo: {
        physicalLocation: {
          contactProfileType: string;
					address: {
						postalCode: string;
						addressLine: string;
						number?: number;
            addressLine2?: string;
            neighborhood: string;
						cityName: string;
						stateProvinceCode: string;
						updatedAt: number | null;
					};
					updatedAt: number | null;
        };
      };
  updatedAt: null;
};


export type ParkingLocationType = 'onsite' | 'offsite';
export type ParkingPrivacyType = 'private' | 'public';

export interface ParkingDetailsForm {
  parkingAvailable: number;
  parkingChargePer?: ChargePer;
  parkingChargeAmount?: number;
  reservationsAvailable: number;
  parkingLocation: ParkingLocationType;
  parkingType: ParkingPrivacyType;
}

export default function PropertyForm(props: Readonly<UrlParams>) {
  const parkingAvailableOptions = {
    0: 'Não',
    1: 'Sim, gratuito',
    2: 'Sim, pago',
  }

  const { id } = props;
  const [activeStep, setActiveStep] = useState(0);
  const[parkingDetailsForm, setParkingDetailsForm] = useState<ParkingDetailsForm>({
    parkingAvailable: 0,
    parkingChargeAmount: 0.00,
    parkingChargePer: 'day' as ChargePer,
    reservationsAvailable: 0,
    parkingLocation: 'onsite' as ParkingLocationType,
    parkingType: 'private' as ParkingPrivacyType,
  });
  const router = useRouter()
  const dispatch = useAppDispatch();
  const initialValues: FormValues = {
    propertyId: '',
    propertyName: '',
    propertyCategory: 0,
    propertyOrganization: '',
    propertyInfo: {
      coordinates: [0, 0],
      checkInFrom: '06:00',
      checkOutTo: '23:00',
      services: [
        {key: 'Biblioteca', value: 0},
        {key: 'Lanchonete', value: 0},
        {key: 'Quadra', value: 0},
        {key: 'Wi-Fi', value: 0},
      ],
    },
    contactInfo: {
        physicalLocation: {
          contactProfileType: "physicalLocation",
          address: {
            addressLine: '',
            number: undefined,
            addressLine2: '',
            neighborhood: '',
            cityName: '',
            stateProvinceCode: '',
            postalCode: '',
            updatedAt: null,
          },
          updatedAt: null,
        }
      },
  updatedAt: null,
}

  const [formData, setFormData] = useState<FormValues>(initialValues);

  // const handleFillAddress = () => {
  //   setFormData();
  // }
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

const steps = ['Informações da propriedade', 'Regras da casa', 'Endereço', 'Serviços', 'Estacionamento'];

const currentValidationSchemas = [
  step1ValidationSchema,
  step2ValidationSchema,
  step3ValidationSchema,
  step4ValidationSchema,
  step5ValidationSchema,
][activeStep];

const handleNext = async (values: FormValues) => {
  const currentSchema = currentValidationSchemas;
    try {
      await currentSchema.validate(values, { abortEarly: false });
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } catch (err) {
      console.error('next btn triggr error', JSON.stringify(err));
      // if (err instanceof Yup.ValidationError) {
      //   err.inner.forEach((error) => {
      //     errors[error.path] = error.message;
      //   });
      //   helpers.setTouched(errors);
      //   helpers.setErrors(errors);
      // }
    }
};

const handleBack = () => {
  setActiveStep((prevActiveStep) => prevActiveStep - 1);
};

  const handleSubmit = (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    // if (id) {
    //   updateProperty(values, id);
    // } else {
      // const newProperty: Property = {
      //   propertyId: values.propertyId,
      //   propertyName: values.propertyName,
      //   propertyCategory: values.propertyCategory,
      //   propertyOrganization: values.propertyOrganization,
      //   propertyInfo: {
      //     coordinates: values.propertyInfo.coordinates,
      //     checkInFrom: values.propertyInfo.checkInFrom,
      //     checkOutTo: values.propertyInfo.checkOutTo,
      //     services: values.propertyInfo.services,
      //   },
      //   contactInfo: values.contactInfo.map((contactInfo) => {
      //     return {
      //       contactProfileType: contactInfo.contactProfileType,
      //       name: contactInfo.name,
      //       email: contactInfo.email,
      //       phone: contactInfo.phone,
      //       address: {
      //         countryCode: contactInfo.address.countryCode,
      //         addressLine: contactInfo.address.addressLine,
      //         number: contactInfo.address?.number,
      //         cityName: contactInfo.address.cityName,
      //         stateProvinceCode: contactInfo.address.stateProvinceCode,
      //         postalCode: contactInfo.address.postalCode,
      //         updatedAt: contactInfo.address.updatedAt,
      //       },
      //       updatedAt: contactInfo.updatedAt,
      //     }}),
      //   updatedAt: values.updatedAt,
      // }
      // dispatch(addPropertyAsync(newProperty));
    // }
    setSubmitting(false);
    router.push('/propriedades');
  }

  return (
    <div style={{ height: '100vh' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: '16px' }}>
        <Anchor href="/propriedades">
          <ArrowBack sx={{ fontSize: 36 }} />
        </Anchor>
        <Title>{id ? "Editar" : "Cadastrar"} propriedade</Title>
      </Box>
      <Box sx={{ mx: 4 }}>
        <Container
          maxWidth="md"
          sx={[
            (theme) => ({
              backgroundColor: '#ffffff',
              ...theme.applyStyles('dark', {
                backgroundColor: '#1C1B1D',
              })
            }),
            { borderRadius: '6px'}
          ]}>
          <Formik
            initialValues={initialValues}
            validationSchema={currentValidationSchemas}
            validateOnChange
            validateOnBlur
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, isValid, handleChange, handleBlur, validateForm, setFieldValue }) => {
              const address = 'contactInfo.physicalLocation.address.';
              const touchedPostalCode = getIn(touched, address + 'postalCode');
              const touchedAddressLine = getIn(touched, address + 'addressLine');
              const touchedNumber = getIn(touched, address + 'number');
              const touchedAddressLine2 = getIn(touched, address + 'addressLine2');
              const touchedNeighborhood = getIn(touched, address + 'neighborhood');
              const touchedCityName = getIn(touched, address + 'cityName');
              const touchedStateProvinceCode = getIn(touched, address + 'stateProvinceCode');

              const errorPostalCode = getIn(errors, address + 'postalCode');
              const errorAddressLine = getIn(errors, address + 'addressLine');
              const errorNumber = getIn(errors, address + 'number');
              const errorAddressLine2 = getIn(errors, address + 'addressLine2');
              const errorNeighborhood = getIn(errors, address + 'neighborhood');

              const errorCityName = getIn(errors, address + 'cityName');
              const errorStateProvinceCode = getIn(errors, address + 'stateProvinceCode');

              return (
              <Form noValidate style={{ padding: '16px', borderRadius: '8px', display: 'grid', gap: '24px'}}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {activeStep === 0 && <Step1PropertyInfo
                  props={{
                    propertyName: { value: values.propertyName, error: errors.propertyName, touched: touched.propertyName },
                    propertyCategory: { value: values.propertyCategory, error: errors.propertyCategory, touched: touched.propertyCategory },
                    propertyOrganization: { value: values.propertyOrganization, error: errors.propertyOrganization, touched: touched.propertyOrganization },
                  }}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                 />}

                {activeStep === 1 && <Step2HouseRules
                  props={{
                    checkInFrom: { touched: touched.propertyInfo?.checkInFrom, error: errors.propertyInfo?.checkInFrom, value: values.propertyInfo?.checkInFrom },
                    checkOutTo: { touched: touched.propertyInfo?.checkOutTo, error: errors.propertyInfo?.checkOutTo, value: values.propertyInfo?.checkOutTo },
                  }}
                />}

                {activeStep === 2 && <Step3Address
                    props={{
                      postalCode: {
                        touched: touchedPostalCode,
                        error: errorPostalCode,
                        value: values.contactInfo.physicalLocation.address.postalCode,
                      },
                      addressLine: {
                        touched: touchedAddressLine,
                        error: errorAddressLine,
                        value: values.contactInfo.physicalLocation.address.addressLine,
                      },
                      number: {
                        touched: touchedNumber,
                        error: errorNumber,
                        value: values.contactInfo.physicalLocation.address.number,
                      },
                      addressLine2: {
                        touched: touchedAddressLine2,
                        error: errorAddressLine2,
                        value: values.contactInfo.physicalLocation.address.addressLine2,
                      },
                      neighborhood: {
                        touched: touchedNeighborhood,
                        error: errorNeighborhood,
                        value: values.contactInfo.physicalLocation.address.neighborhood,
                      },
                      cityName: {
                        touched: touchedCityName,
                        error: errorCityName,
                        value: values.contactInfo.physicalLocation.address.cityName,
                      },
                      stateProvinceCode: {
                        touched: touchedStateProvinceCode,
                        error: errorStateProvinceCode,
                        value: values.contactInfo.physicalLocation.address.stateProvinceCode,
                      },
                    }}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                  />}

                {activeStep === 3 && (
                    <div>
                      {values.propertyInfo.services.map((service, index) => (
                        <div key={index}>
                           <FormGroup>
                              <FormControlLabel control={<Checkbox value={service.value}/>} label={service.key} />
                            </FormGroup>
                        </div>
                      ))}
                    </div>
                )}

                {activeStep === 4 && (
                  <>
                    <FormControl>
                      <FormLabel id="demo-controlled-radio-buttons-group">O estacionamento está disponível para as pessoas?</FormLabel>
                      <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={parkingDetailsForm.parkingAvailable}
                        onChange={e => setParkingDetailsForm((prevProps) => {
                          return { ...prevProps, parkingAvailable: parseInt(e.target.value)}
                        })}
                      >
                        {Object.entries(parkingAvailableOptions).map(([key, value]) => (
                          <FormControlLabel key={key} value={key} control={<Radio />} label={value} />
                        ))}
                      </RadioGroup>
                    </FormControl>
                      {parkingDetailsForm.parkingAvailable === 2 && (
                        <Box
                          sx={{
                            minwidth: 120,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'start',
                            alignItems: 'end',
                            gap: '8px',
                          }}
                        >
                          <FormControl>
                          <FormLabel id="adornment-amount">Quanto custa o estacionamento?</FormLabel>
                            <OutlinedInput
                              id="adornment-amount"
                              startAdornment={<InputAdornment position="start">R$</InputAdornment>}
                              value={parkingDetailsForm.parkingChargeAmount}
                              onChange={e => setParkingDetailsForm((prevProps) => {
                                return { ...prevProps, parkingChargeAmount: parseFloat(e.target.value)}
                              })}
                              type="number" 
                              placeholder="0.00"
                            />
                            </FormControl>
                              <Select
                                defaultValue='day'
                                value={parkingDetailsForm.parkingChargePer}
                                onChange={e => setParkingDetailsForm((prevProps) => {
                                  return { ...prevProps, parkingChargePer: (e.target.value as ChargePer)}
                                })}
                                inputProps={{
                                  name: 'Custo por',
                                  id: 'charge-per',
                                }}
                                variant='outlined'
                              >
                                <MenuItem value="hour">Por hora</MenuItem>
                                <MenuItem value="day">Por dia</MenuItem>
                                <MenuItem value="month">Por mês</MenuItem>
                                <MenuItem value="stay">Por estadia</MenuItem>
                              </Select>
                        </Box>
                      )}
                    {parkingDetailsForm.parkingAvailable !==  0 && (
                      <>
                        <FormControl>
                          <FormLabel id="reservations-available-label">É necessário fazer reservas?</FormLabel>
                          <RadioGroup
                            aria-labelledby="reservations-available-label"
                            name="reservations-available-radio-buttons-group"
                            value={parkingDetailsForm.reservationsAvailable}
                            onChange={({ target }) => setParkingDetailsForm((prevProps) => {
                              return { ...prevProps, reservationsAvailable: parseInt(target.value)}
                            })}
                          >
                            <FormControlLabel value="1" control={<Radio />} label="Sim" />
                            <FormControlLabel value="0" control={<Radio />} label="Não" />
                          </RadioGroup>
                        </FormControl>
                        <FormControl>
                          <FormLabel id="">Onde o estacionamento está localizado?</FormLabel>
                          <RadioGroup
                            aria-labelledby="parking-location-label"
                            name="parking-location-radio-buttons-group"
                            value={parkingDetailsForm.parkingLocation}
                            onChange={
                              (e) => {
                                setParkingDetailsForm((prevProps) => {
                                  return {...prevProps, parkingLocation: (e.target.value as ParkingLocationType)}
                                })
                              }
                            }
                          >
                            <FormControlLabel value="onsite" control={<Radio />} label="Interno, dentro da empresa" />
                            <FormControlLabel value="offsite" control={<Radio />} label="Externo, fora da empresa" />
                          </RadioGroup>
                        </FormControl>
                        <FormControl>
                          <FormLabel id="">Que tipo de estacionamento é?</FormLabel>
                          <RadioGroup
                            aria-labelledby="parking-type-label"
                            name="parking-type-radio-buttons-group"
                            value={parkingDetailsForm.parkingType}
                            onChange={
                              (e) => {
                                setParkingDetailsForm((prevProps) => {
                                  return {...prevProps, parkingType: (e.target.value as ParkingPrivacyType)}
                                })
                              }
                            }
                          >
                            <FormControlLabel value="private" control={<Radio />} label="Privado" />
                            <FormControlLabel value="public" control={<Radio />} label="Público" />
                          </RadioGroup>
                        </FormControl>
                      </>
                    )}
                  </>
                )}

                {!isValid && (
                  <span>Todos os campos precisam ser preenchidos corretamente</span>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  {activeStep > 0 && (
                    <Button onClick={handleBack}>Voltar</Button>
                  )}
                  {activeStep < steps.length - 1 ? (
                    <Button variant="contained" color="primary" onClick={() => validateForm().then(() => handleNext(values))}>
                      Próximo
                    </Button>
                  ) : (
                    <Button type="submit" variant="contained" color="primary">
                      Salvar
                    </Button>
                  )}
                </div>
              </Form>
            )}}
          </Formik>
        </Container>
      </Box>
  </div>
  );
}
