'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Box } from '@mui/material';
import { Formik, Form, FieldArray, FormikHelpers, getIn } from 'formik'
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBack from '@mui/icons-material/ArrowBack';
import * as Yup from 'yup'
import { ulid } from "ulidx";
import Anchor from '@/lib/common/components/Anchor';
import {  ButtonContainer, Container, FlexContainer, GridContainer} from './styles';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { addCustomer, getCustomers, updateCustomer } from '../customersSlice';
import { Vehicle } from '@/lib/db/idb';
import { addVehicle, getVehicles, updateVehicle } from '../../vehicles/vehicleSlice';
import { CustomerFormValues } from "./types";
import { useCustomerFormInitialization } from './useCustomerFormInitialization';
import useMergeCustomerWithVehicles from './useMergeCustomerWithVehicles';

interface UrlParams {
  id: string;
};

function parseStringToNumberOrNull(value: string | undefined) {
  return value ? parseInt(value) : null;
}

export default function CustomerForm(props: Readonly<UrlParams>) {
  const { id } = props;
  const vehiclesState = useAppSelector((state) => state.vehicles);
	const customersState = useAppSelector((state) => state.customers);
	const customer = customersState.entities[id];
	const vehicles = Object.values(vehiclesState.entities);
  const router = useRouter()
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const customerWithVehicles = useMergeCustomerWithVehicles(customer, vehicles);
  const formData = useCustomerFormInitialization(customerWithVehicles);

  console.log('customerWithVehicles', customerWithVehicles)

  useEffect(() => {
    dispatch(getVehicles());
    dispatch(getCustomers());
  }, [dispatch]);

  const handleAddCustomer = (values: CustomerFormValues) => {
    const { name, email, taxpayerRegistration, phone, vehicles } = values;
    const phoneNumber = parseStringToNumberOrNull(phone);
    const taxpayerRegistrationNumber = parseInt(taxpayerRegistration);
    const customerId = ulid();
    dispatch(addCustomer({ id: customerId, name, email, phone: phoneNumber, taxpayerRegistration: taxpayerRegistrationNumber, updatedAt: null }));
    if (vehicles.length > 0) {
      for(const vehicle of vehicles) {
        const vehicleId = ulid();
        const { brand, model, year, color, variant, licensePlate } = vehicle;
        const vehicleData = {
          id: vehicleId, brand: brand ?? '',  model: model ?? '',  year: parseStringToNumberOrNull(year),  color: color ?? '',  variant: variant ?? '', licensePlate: licensePlate ?? '', customerId, updatedAt: null
        } as Vehicle;
        dispatch(addVehicle(vehicleData));
      }
    }
  };

  const handleEditCustomer = (values: CustomerFormValues) => {
    const { name, email, taxpayerRegistration, phone, vehicles } = values;
    const phoneNumber = parseStringToNumberOrNull(phone);
    const taxpayerRegistrationNumber = parseInt(taxpayerRegistration);
    dispatch(updateCustomer({id, name, email, taxpayerRegistration: taxpayerRegistrationNumber, phone: phoneNumber, updatedAt: new Date().getTime()}));
    for(const vehicle of vehicles) {
      if (!vehicle.licensePlate) {
        setError(`Placa do carro ${vehicle.licensePlate} não encontrada`);
        return console.error('License plate not found');
      };
      const { id, brand, model, year, color, variant, licensePlate } = vehicle;
      const vehicleData = {
        id: vehicle.id, brand: brand ?? '',  model: model ?? '',  year: parseStringToNumberOrNull(year),  color: color ?? '',  variant: variant ?? '', licensePlate: licensePlate ?? '', customerId: id, updatedAt: new Date().getTime(),
      } as Vehicle;
      dispatch(updateVehicle(vehicleData));
    }
  }

  const initialValues = {
      name: '',
      email: '',
      taxpayerRegistration: '',
      phone: '',
      vehicles: [
        {
          brand: '',
          model: '',
          year: '',
          color: '',
          variant: '',
          licensePlate: '',
        }
      ]
  }

  const validationSchema = Yup.object().shape({
   name: Yup.string().min(2, 'Nome muito curto').trim().required('Nome é obrigatório'),
   email: Yup.string().trim().email('Email inválido').nullable(),
   taxpayerRegistration: Yup.number().max(99999999999, 'CPF inválido').required('CPF é obrigatório'),
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
  })

  const handleSubmit = (values: CustomerFormValues, { setSubmitting }: FormikHelpers<CustomerFormValues>) => {
    if (id) {
      handleEditCustomer(values);
    } else {
      handleAddCustomer(values);
    }
    setSubmitting(false);
    router.push('/motoristas')
  }

  return (
      <Box sx={{ mx: 4 }}>
        <Anchor href="/motoristas">
          <ArrowBack sx={{ fontSize: 36, color: '#000' }} />
        </Anchor>
        <h1>{id ? "Editar" : "Cadastrar"} Motorista</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Formik
          initialValues={formData || initialValues}
          validationSchema={validationSchema}
          validateOnChange
          validateOnBlur
          onSubmit={handleSubmit}
          enableReinitialize
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
                  {({ remove, push }) => (
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
                                onClick={() => remove(index)}
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
                          <Button variant="contained" color="info" onClick={() => push({ brand: '', model: '', year: '', color: '', plate: '' })}>
                            +1 Veículo
                          </Button>
                        </Box>
                      </div>
                  )}
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
  );
}
function initDB() {
  throw new Error('Function not implemented.');
}

