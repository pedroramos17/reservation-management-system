'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Box } from '@mui/material';
import { Formik, Form, FieldArray, FormikHelpers, getIn } from 'formik'
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBack from '@mui/icons-material/ArrowBack';
import * as Yup from 'yup'
import Anchor from '@/lib/common/components/Anchor';
import { ButtonContainer, Container, FlexContainer, GridContainer } from '@/lib/common/components/styles/form';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { useCustomerForm } from './useCustomerForm';
import { getCustomersAsync, selectCustomerById, selectVehiclesByCustomerId } from './customersSlice';
import { Vehicle } from '@/lib/db/idb';
import { getVehiclesAsync } from '../vehicles/vehiclesSlice';

interface UrlParams {
  id: string;
};

export interface CustomerFormValues {
	name: string;
	email: string;
	taxpayerRegistration: string;
	phone: string;
	vehicles: {
		id: string;
		brand: string;
		model: string;
		year: string;
		color: string;
		variant: string;
		licensePlate: string;
	}[];
}

type vehicleFormType = Omit<Vehicle, 'uptadedAt' | 'customerId'>;

export default function CustomerForm(props: Readonly<UrlParams>) {
  const { id } = props;
  const router = useRouter()
  const dispatch = useAppDispatch();
  const [vehiclesRemoved, setVehiclesRemoved] = useState<vehicleFormType[]>([]);
  const { addCustomer, updateCustomer } = useCustomerForm();
  const initialValues = {
    name: '',
    email: '',
    taxpayerRegistration: '',
    phone: '',
    vehicles: [
      {
        id: '',
        brand: '',
        model: '',
        year: '',
        color: '',
        variant: '',
        licensePlate: '',
      }
    ]
}
  const [formData, setFormData] = useState<CustomerFormValues>(initialValues);
  useEffect(() => {
    dispatch(getCustomersAsync());
    dispatch(getVehiclesAsync());
  }, [dispatch]);
  const customer = useAppSelector(state => selectCustomerById(state, id));
  const customerVehicles: Vehicle[] = useAppSelector(state => selectVehiclesByCustomerId(state, id));

  function parseNumberOrNullToString(value: number | null) {
    return value ? String(value) : "";
  }
const handleFillForm = useCallback(() => {
  if (customer) {
    const { name, email, taxpayerRegistration, phone } = customer;
    const vehicles = customerVehicles.map(vehicle => ({ id: vehicle.id, brand: vehicle.brand, model: vehicle.model, year: parseNumberOrNullToString(vehicle.year), color: vehicle.color, variant: vehicle.variant, licensePlate: vehicle.licensePlate })); 
    setFormData({ name, email, taxpayerRegistration: parseNumberOrNullToString(taxpayerRegistration), phone: parseNumberOrNullToString(phone), vehicles });  
  }
}, [customerVehicles, customer]);

useEffect(() => {
  if (id) {
    handleFillForm();
  }
}, [handleFillForm, id]);

  const validationSchema = Yup.object().shape({
   name: Yup.string().min(2, 'Nome muito curto').trim().required('Nome é obrigatório'),
   email: Yup.string().trim().email('Email inválido').nullable(),
   taxpayerRegistration: Yup.number().max(99999999999, 'CPF deve ter 11 dígitos').required('CPF é obrigatório'),
    phone: Yup.string().trim().nullable(),
    vehicles: Yup.array().of(
      Yup.object().shape({
        brand: Yup.string().trim().nullable(),
        model: Yup.string().trim().nullable(),
        year: Yup.string().trim().nullable(),
        color: Yup.string().trim().nullable(),
        variant: Yup.string().trim().nullable(),
        licensePlate: Yup.string().trim().required('Placa é obrigatório'),
      }).nullable(),
    )
  });

  const handleSubmit = (values: CustomerFormValues, { setSubmitting }: FormikHelpers<CustomerFormValues>) => {
    if (id) {
      updateCustomer(values, id);
    } else {
      addCustomer(values);
    }
    setSubmitting(false);
    router.push('/motoristas')
  }

  return (
        <div>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: '16px' }}>
          <Anchor href="/motoristas">
            <ArrowBack sx={{ fontSize: 36 }} />
          </Anchor>
          <h1>{id ? "Editar" : "Cadastrar"} Motorista</h1>
        </Box>
          <Box sx={{ mx: 4 }}>
        <Formik
          initialValues={formData || initialValues}
          validationSchema={validationSchema}
          validateOnChange
          validateOnBlur
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ values, touched, errors, handleChange, handleBlur, isValid } ) => {
            const touchedName = getIn(touched, 'name');
            const errorName = getIn(errors, 'name');
            const touchedEmail = getIn(touched, 'email');
            const errorEmail = getIn(errors, 'email');
            const touchedTaxpayerRegistration = getIn(touched, 'taxpayerRegistration');
            const errorTaxpayerRegistration = getIn(errors, 'taxpayerRegistration');
            const touchedPhone = getIn(touched, 'phone');
            const errorPhone = getIn(errors, 'phone');
            return (
            <Form noValidate>
              <Container>
                <TextField 
                  label="Nome"
                  variant="standard"
                  name="name"
                  value={values.name}
                  helperText={ touchedName && errorName ? errorName : ""}
                  error={Boolean(touchedName && errorName)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  autoFocus
                />
                <TextField
                    label="Email"
                    variant="standard"
                    name="email"
                    value={values.email}
                    helperText={ touchedEmail && errorEmail ? errorEmail : ""}
                    error={Boolean(touchedEmail && errorEmail)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                <FlexContainer>
                  <TextField
                    label="CPF"
                    variant="standard"
                    name="taxpayerRegistration"
                    value={values.taxpayerRegistration}
                    helperText={ touchedTaxpayerRegistration && errorTaxpayerRegistration ? errorTaxpayerRegistration : ""}
                    error={Boolean(touchedTaxpayerRegistration && errorTaxpayerRegistration)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  <TextField
                    label="Telefone"
                    variant="standard"
                    name="phone"
                    value={values.phone}
                    helperText={ touchedPhone && errorPhone ? errorPhone : ""}
                    error={Boolean(touchedPhone && errorPhone)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </FlexContainer>
                <h2>Adicionar Veículo</h2>
                <FieldArray name='vehicles'>
                  {({ remove, push }) => {
                    const handleAddVehicle = () => {
                      if (vehiclesRemoved.length > 0) {
                        push(vehiclesRemoved.at(-1));
                        setVehiclesRemoved(prevItems => prevItems.slice(0, -1));
                      } else {
                        push({ vehicleId: '', brand: '', model: '', year: '', color: '', variant: '', licensePlate: '' });
                      }
                    }
                  return (
                    <div>
                      {values.vehicles?.length > 0 &&
                        values.vehicles.map((_, index) => {
                          const vehicleId = `vehicles[${index}].vehicleId`;
                          const brand = `vehicles[${index}].brand`;
                          const model = `vehicles[${index}].model`;
                          const year = `vehicles[${index}].year`;
                          const color = `vehicles[${index}].color`;
                          const variant = `vehicles[${index}].variant`;
                          const plate = `vehicles[${index}].licensePlate`;

                          const touchedBrand = getIn(touched, brand);
                          const errorBrand = getIn(errors, brand);

                          const touchedModel = getIn(touched, model);
                          const errorModel = getIn(errors, model);

                          const touchedYear = getIn(touched, year);
                          const errorYear = getIn(errors, year);

                          const touchedColor = getIn(touched, color);
                          const errorColor = getIn(errors, color);

                          const touchedVariant = getIn(touched, variant);
                          const errorVariant = getIn(errors, variant);

                          const touchedPlate = getIn(touched, plate);
                          const errorPlate = getIn(errors, plate);

                          return (
                          <div key={vehicleId} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          <Box sx={{ mt: 4 }}>
                              <Button
                                variant="outlined"
                                color="error"
                                onClick={() => {
                                  const removedItem = remove<vehicleFormType>(index);
                                  setVehiclesRemoved(prevItems => {
                                  return removedItem === undefined ? prevItems : [...prevItems, removedItem]; 
                                })}}
                              ><RemoveIcon /></Button>
                            </Box>
                            <GridContainer>
                            <TextField
                              label="Marca"
                              variant="standard"
                              name={brand}
                              value={values?.vehicles[index]?.brand}
                              helperText={ touchedBrand && errorBrand ? errorBrand : ""}
                              error={Boolean(touchedBrand && errorBrand)}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <TextField
                              label="Modelo"
                              variant="standard"
                              name={model}
                              value={values.vehicles[index]?.model}
                              helperText={ touchedModel && errorModel ? errorModel : ""}
                              error={Boolean(touchedModel && errorModel)}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <TextField
                              label="Ano"
                              variant="standard"
                              name={year}
                              value={values.vehicles[index]?.year}
                              helperText={ touchedYear && errorYear ? errorYear : ""}
                              error={Boolean(touchedYear && errorYear)}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <TextField
                              label="Cor"
                              variant="standard"
                              name={color}
                              value={values.vehicles[index]?.color}
                              helperText={ touchedColor && errorColor ? errorColor : ""}
                              error={Boolean(touchedColor && errorColor)}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <TextField
                              label="Variante"
                              variant="standard"
                              name={variant}
                              value={values.vehicles[index]?.variant}
                              helperText={ touchedVariant && errorVariant ? errorVariant : ""}
                              error={Boolean(touchedVariant && errorVariant)}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <TextField
                              label="Placa"
                              variant="standard"
                              name={plate}
                              value={values.vehicles[index]?.licensePlate}
                              helperText={ touchedPlate && errorPlate ? errorPlate : ""}
                              error={Boolean(touchedPlate && errorPlate)}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              required
                            />
                            </GridContainer>
                          </div>
                        )})}
                        <Box sx={{ my: 4 }}>
                          <Button variant="contained" color="info" onClick={() => handleAddVehicle()}>
                            +1 Veículo
                          </Button>
                        </Box>
                      </div>
                  )}}
                </FieldArray>
                {!isValid && (
                  <span>Todos os campos precisam ser preenchidos corretamente</span>
                )}
                <ButtonContainer>
                  <Button type="submit" variant="contained" >Salvar</Button>
                </ButtonContainer>
              </Container>
            </Form>
          )}}
        </Formik>
      </Box>
      </div>
  );
}
