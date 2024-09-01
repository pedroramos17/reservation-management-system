'use client';

import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { TextField, Button, Box } from '@mui/material';
import { Formik, Form, FieldArray, FormikHelpers, getIn } from 'formik'
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBack from '@mui/icons-material/ArrowBack';
import * as Yup from 'yup'
import { ulid } from "ulidx";
import Anchor from '@/lib/common/components/Link';
import {  ButtonContainer, Container, FlexContainer, GridContainer} from './styles';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { addCustomer, updateCustomer } from '../customersSlice';
import { Vehicle } from '@/lib/db/idb';
import { addVehicle, updateVehicle } from '../../vehicles/vehicleSlice';

interface UrlParams {
  id: string;
};

interface CustomerFormValues {
  name: string;
  email: string;
  taxpayerRegistration: string;
  phone?: string;
  vehicles: {
    brand?: string;
    model?: string;
    year?: string;
    color?: string;
    variant?: string;
    licensePlate?: string;
  }[];
}

function parseStringToNumber(value: string | undefined) {
  return value ? parseInt(value) : 0;
}

export default function CustomerForm(props: Readonly<UrlParams>) {
  const dispatch = useAppDispatch();
  const vehiclesState = useAppSelector((state) => state.vehicles);
  const customersState = useAppSelector((state) => state.customers);
  const { id } = props;
  const [error, setError] = useState<string | null>(null);
  const { data, loading } = useAppSelector((state) => state.customerForm);
  const [formCustomerValue, setFormCustomerValue] = useState<CustomerFormValues>({
    name: '',
    email: '',
    taxpayerRegistration: "",
    phone: "",
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
  })

  const handleAddCustomer = async (values: CustomerFormValues) => {
    const { name, email, taxpayerRegistration, phone, vehicles } = values;
    const phoneNumber = parseStringToNumber(phone);
    const taxpayerRegistrationNumber = parseStringToNumber(taxpayerRegistration);
    const customerId = ulid();
    dispatch(addCustomer({ id: customerId, name, email, phone: phoneNumber, taxpayerRegistration: taxpayerRegistrationNumber, updatedAt: null }));
    if (vehicles.length > 0) {
      for(const vehicle of vehicles) {
        const vehicleId = ulid();
        const { brand, model, year, color, variant, licensePlate } = vehicle;
        const vehicleData = {
          id: vehicleId, brand: brand ?? '',  model: model ?? '',  year: year ?? 0,  color: color ?? '',  variant: variant ?? '', licensePlate: licensePlate ?? '', driverId: customerId, updatedAt: null
        } as Vehicle;
        dispatch(addVehicle(vehicleData));
      }
    }
  };

  const handleEditCustomer = (values: CustomerFormValues) => {
    const { name, email, taxpayerRegistration, phone, vehicles } = values;
    const phoneNumber = parseStringToNumber(phone);
    const taxpayerRegistrationNumber = parseStringToNumber(taxpayerRegistration);
    dispatch(updateCustomer({id, name, email, taxpayerRegistration: taxpayerRegistrationNumber, phone: phoneNumber, updatedAt: new Date().getTime()}));
    if (vehicles.length > 0) {
      for(const vehicle of vehicles) {
        if (!vehicle.licensePlate) return console.error('License plate is required');
        const vehicleState =  vehiclesState.entities[vehicle.licensePlate];
        const { brand, model, year, color, variant, licensePlate } = vehicleState;
        const vehicleData = {
          id: vehicleState.id, brand: brand ?? '',  model: model ?? '',  year: year ?? 0,  color: color ?? '',  variant: variant ?? '', licensePlate: licensePlate ?? '', driverId: id, updatedAt: null
        } as Vehicle;
        dispatch(updateVehicle(vehicleData));
      }
    }
  }

  const handleFillForm = () => {
    if (id) {
      const driver = customersState.entities[id];
      setFormCustomerValue(driver as unknown as CustomerFormValues);
    }
  }
    
    useEffect(() => {
      handleFillForm();
    })
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
        licensePlate: Yup.string().trim().required('Placa é obrigatório'),
      }).nullable(),
    )
  })

  const handleSubmit = async (values: CustomerFormValues, { setSubmitting }: FormikHelpers<CustomerFormValues>) => {
    if (id) {
      handleEditCustomer(values);
    } else {
      handleAddCustomer(values);
    }
    setSubmitting(false);
    redirect('/motoristas');
  }

  return (
      <Box sx={{ mx: 4 }}>
        <Anchor href="/motoristas">
          <ArrowBack sx={{ fontSize: 36, color: '#000' }} />
        </Anchor>
        <h1>{id ? "Editar" : "Cadastrar"} Motorista</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Formik
          initialValues={formCustomerValue || initialValues}
          validationSchema={validationSchema}
          validateOnChange
          validateOnBlur
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, touched, errors, handleChange, handleBlur, isValid } ) => {
            const touchedName = getIn(touched, 'name');
            const errorName = getIn(errors, 'name');
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
                          const plate = `vehicles[${index}].plate`;

                          const touchedBrand = getIn(touched, brand);
                          const errorBrand = getIn(errors, brand);

                          const touchedModel = getIn(touched, model);
                          const errorModel = getIn(errors, model);

                          const touchedYear = getIn(touched, year);
                          const errorYear = getIn(errors, year);

                          const touchedColor = getIn(touched, color);
                          const errorColor = getIn(errors, color);

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

