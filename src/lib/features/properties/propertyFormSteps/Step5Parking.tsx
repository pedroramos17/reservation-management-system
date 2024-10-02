'use client';
import 'client-only';
import { ChargePer } from "@/lib/db/idb"
import { Box, FormControl, FormControlLabel, FormLabel, InputAdornment, MenuItem, OutlinedInput, Radio, RadioGroup, Select } from "@mui/material"
import { useState } from "react";



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

export default function Step5Parking() {
    const parkingAvailableOptions = {
        0: 'Não',
        1: 'Sim, gratuito',
        2: 'Sim, pago',
      }
    
    const[parkingDetailsForm, setParkingDetailsForm] = useState<ParkingDetailsForm>({
        parkingAvailable: 0,
        parkingChargeAmount: 0.00,
        parkingChargePer: 'day' as ChargePer,
        reservationsAvailable: 0,
        parkingLocation: 'onsite' as ParkingLocationType,
        parkingType: 'private' as ParkingPrivacyType,
      });

    return (
        <>
          <FormControl>
            <FormLabel id="parking-available-label">O estacionamento está disponível para as pessoas?</FormLabel>
            <RadioGroup
              aria-labelledby="parking-available-label"
              name="parking.available"
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
                <FormLabel id="parking-charge-amount-label">Quanto custa o estacionamento?</FormLabel>
                  <OutlinedInput
                    id="parking-charge-amount"
                    aria-labelledby="parking-charge-amount-label"
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
                      id="parking-charge-per"
                      name='parking.chargePer'
                      value={parkingDetailsForm.parkingChargePer}
                      onChange={e => setParkingDetailsForm((prevProps) => {
                        return { ...prevProps, parkingChargePer: (e.target.value as ChargePer)}
                      })}
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
                  name="reservations.available"
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
                <FormLabel id="parking-location-label">Onde o estacionamento está localizado?</FormLabel>
                <RadioGroup
                  aria-labelledby="parking-location-label"
                  name="parking.location"
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
                <FormLabel id="parking-type-label">Que tipo de estacionamento é?</FormLabel>
                <RadioGroup
                  aria-labelledby="parking-type-label"
                  name="parking.type"
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
      )
    }