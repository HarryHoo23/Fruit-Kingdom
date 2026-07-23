import { useQuery } from "@tanstack/react-query";
import { getAllCitiesOfCountry, getCountries, type ICity, type ICountry } from "@countrystatecity/countries-browser";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type LocationAutocompleteFieldsProps = {
  city: string;
  country: string;
  disabled?: boolean;
  onCityChange: (value: string) => void;
  onCountryChange: (value: string) => void;
};

const fieldClasses =
  "min-h-12 w-full rounded-fruit border-2 border-fruit-cardBorder bg-fruit-input px-3.5 py-3 text-fruit-text outline-none focus:border-fruit-inputFocus focus:shadow-input-focus disabled:opacity-60";
const labelClasses = "grid gap-1.5 text-sm font-black text-fruit-text";
const maxSuggestions = 8;

const includesQuery = (value: string, query: string) =>
  value.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());

export const LocationAutocompleteFields = ({
  city,
  country,
  disabled = false,
  onCityChange,
  onCountryChange,
}: LocationAutocompleteFieldsProps) => {
  const { t } = useTranslation();
  const [countryOpen, setCountryOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [countryCode, setCountryCode] = useState(() =>
    country.trim().toLocaleLowerCase() === "australia" ? "AU" : "",
  );
  const countryRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  const countriesQuery = useQuery({
    queryKey: ["location", "countries"],
    queryFn: getCountries,
    staleTime: 24 * 60 * 60 * 1000,
  });

  const citiesQuery = useQuery({
    queryKey: ["location", "cities", countryCode],
    queryFn: () => getAllCitiesOfCountry(countryCode),
    enabled: Boolean(countryCode),
    staleTime: 24 * 60 * 60 * 1000,
  });

  const countrySuggestions = useMemo(() => {
    if (!country.trim()) return [];
    return (countriesQuery.data ?? [])
      .filter((item) => includesQuery(item.name, country) || item.iso2.toLowerCase() === country.trim().toLowerCase())
      .slice(0, maxSuggestions);
  }, [country, countriesQuery.data]);

  const citySuggestions = useMemo(() => {
    if (!city.trim()) return [];
    return (citiesQuery.data ?? [])
      .filter((item) => includesQuery(item.name, city))
      .slice(0, maxSuggestions);
  }, [city, citiesQuery.data]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!countryRef.current?.contains(target)) setCountryOpen(false);
      if (!cityRef.current?.contains(target)) setCityOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const chooseCountry = (item: ICountry) => {
    onCountryChange(item.name);
    setCountryCode(item.iso2);
    setCountryOpen(false);
  };

  const chooseCity = (item: ICity) => {
    onCityChange(item.name);
    setCityOpen(false);
  };

  return (
    <div className="grid grid-cols-2 gap-3 max-[560px]:grid-cols-1">
      <div ref={countryRef} className="relative">
        <label className={labelClasses}>
          {t("memories.form.country")}
          <input
            className={fieldClasses}
            maxLength={80}
            autoComplete="country-name"
            disabled={disabled}
            value={country}
            onFocus={() => setCountryOpen(true)}
            onChange={(event) => {
              onCountryChange(event.target.value);
              setCountryCode("");
              setCountryOpen(true);
            }}
          />
        </label>
        {countryOpen && countrySuggestions.length > 0 && (
          <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-fruit border-2 border-fruit-cardBorder bg-fruit-paper p-1 shadow-fruit" role="listbox">
            {countrySuggestions.map((item) => (
              <li key={item.iso2}>
                <button
                  type="button"
                  className="w-full rounded-xl px-3 py-2 text-left font-bold text-fruit-text hover:bg-fruit-input"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => chooseCountry(item)}
                >
                  {item.emoji} {item.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div ref={cityRef} className="relative">
        <label className={labelClasses}>
          {t("memories.form.city")}
          <input
            className={fieldClasses}
            maxLength={80}
            autoComplete="address-level2"
            disabled={disabled}
            value={city}
            onFocus={() => setCityOpen(true)}
            onChange={(event) => {
              onCityChange(event.target.value);
              setCityOpen(true);
            }}
          />
        </label>
        {cityOpen && countryCode && citySuggestions.length > 0 && (
          <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-fruit border-2 border-fruit-cardBorder bg-fruit-paper p-1 shadow-fruit" role="listbox">
            {citySuggestions.map((item) => (
              <li key={`${item.state_code}-${item.id}`}>
                <button
                  type="button"
                  className="w-full rounded-xl px-3 py-2 text-left font-bold text-fruit-text hover:bg-fruit-input"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => chooseCity(item)}
                >
                  {item.name}
                  {item.state_code ? <span className="ml-2 text-xs text-fruit-soft">{item.state_code}</span> : null}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
