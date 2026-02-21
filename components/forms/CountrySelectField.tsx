"use client"
import { Controller } from "react-hook-form"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
// @ts-ignore - no types available for this package
import countryList from 'react-select-country-list'
// @ts-ignore - no types available for this package
import ReactCountryFlag from "react-country-flag"
import { useState, useMemo } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

type Country = {
  value: string;
  label: string;
}

const CountrySelectField = ({
  name,
  label,
  control,
  error,
  required = false
}: CountrySelectProps) => {
  const countries = useMemo(() => countryList().getData() as Country[], [])

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Controller 
        name={name} 
        control={control}
        rules={{
          required: required ? `Please select ${label}` : false
        }}
        render={({ field }) => {
          const [open, setOpen] = useState(false)
          const selectedCountry = countries.find((c: Country) => c.value === field.value)

          return (
            <>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between select-trigger"
                  >
                    {selectedCountry ? (
                      <div className="flex items-center gap-2">
                        <ReactCountryFlag 
                          countryCode={selectedCountry.value} 
                          svg 
                          style={{
                            width: '1.5em',
                            height: '1.5em',
                          }}
                        />
                        <span>{selectedCountry.label}</span>
                      </div>
                    ) : (
                      <span>Select your country...</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-gray-600 text-white border-gray-500" align="start">
                  <Command className="bg-gray-600 text-white">
                    <CommandInput placeholder="Search country..." className="text-white" />
                    <CommandList className="max-h-60">
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup>
                        {countries.map((country: Country) => (
                          <CommandItem
                            key={country.value}
                            value={country.label}
                            onSelect={() => {
                              field.onChange(country.value)
                              setOpen(false)
                            }}
                            className="cursor-pointer hover:bg-gray-700"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === country.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex items-center gap-2">
                              <ReactCountryFlag 
                                countryCode={country.value} 
                                svg 
                                style={{
                                  width: '1.5em',
                                  height: '1.5em',
                                }}
                              />
                              <span>{country.label}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
            </>
          )
        }}
      />
    </div>
  )
}

export default CountrySelectField
