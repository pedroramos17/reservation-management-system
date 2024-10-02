'use client';

import 'client-only';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Container,
  Stepper,
  Step,
  StepLabel,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
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
import Step5Parking from './propertyFormSteps/Step5Parking';

interface UrlParams {
  id: string;
};

export interface FormValues {
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

export default function PropertyForm(props: Readonly<UrlParams>) {
  const { id } = props;
  const [activeStep, setActiveStep] = useState(0);
  
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
            {({ values, handleChange, handleBlur, validateForm }) => {
              

              return (
              <Form noValidate style={{ padding: '16px', borderRadius: '8px', display: 'grid', gap: '24px'}}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {activeStep === 0 && <Step1PropertyInfo />}

                {activeStep === 1 && <Step2HouseRules/>}

                {activeStep === 2 && <Step3Address />}

                {activeStep === 3 && (
                    <div>
                      {values.propertyInfo.services.map((service) => (
                        <div key={service.key}>
                           <FormGroup>
                              <FormControlLabel
                                control={<Checkbox value={service.value}/>}
                                label={service.key}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                            </FormGroup>
                        </div>
                      ))}
                    </div>
                )}

                {activeStep === 4 && <Step5Parking />}

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
