/*
 * SakuYado - A web application that helps you find the best value accommodations
 * Copyright (C) 2025  Sakan Nirattisaykul
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

export interface Currency {
  code: string;
  name: string;
  multiplier: number;
}

export const CURRENCIES: Currency[] = [
  { code: "AED", name: "United Arab Emirates Dirham", multiplier: 0.27 },
  { code: "ARS", name: "Argentine Peso", multiplier: 0.001 },
  { code: "AUD", name: "Australian Dollar", multiplier: 0.64 },
  { code: "AZN", name: "Azerbaijani Manat", multiplier: 0.59 },
  { code: "BHD", name: "Bahraini Dinar", multiplier: 2.65 },
  { code: "BGN", name: "Bulgarian Lev", multiplier: 0.55 },
  { code: "BRL", name: "Brazilian Real", multiplier: 0.18 },
  { code: "CAD", name: "Canadian Dollar", multiplier: 0.73 },
  { code: "CHF", name: "Swiss Franc", multiplier: 1.12 },
  { code: "CLP", name: "Chilean Peso", multiplier: 0.001 },
  { code: "CNY", name: "Chinese Yuan", multiplier: 0.14 },
  { code: "COP", name: "Colombian Peso", multiplier: 0.0002 },
  { code: "CZK", name: "Czech Koruna", multiplier: 0.042 },
  { code: "DKK", name: "Danish Krone", multiplier: 0.14 },
  { code: "EGP", name: "Egyptian Pound", multiplier: 0.021 },
  { code: "EUR", name: "Euro", multiplier: 1.07 },
  { code: "FJD", name: "Fijian Dollar", multiplier: 0.44 },
  { code: "GBP", name: "Pound Sterling", multiplier: 1.31 },
  { code: "GEL", name: "Georgian Lari", multiplier: 0.36 },
  { code: "HKD", name: "Hong Kong Dollar", multiplier: 0.13 },
  { code: "HUF", name: "Hungarian Forint", multiplier: 0.0026 },
  { code: "IDR", name: "Indonesian Rupiah", multiplier: 0.000064 },
  { code: "ILS", name: "Israeli New Shekel", multiplier: 0.27 },
  { code: "INR", name: "Indian Rupee", multiplier: 0.012 },
  { code: "ISK", name: "Icelandic Króna", multiplier: 0.0072 },
  { code: "JPY", name: "Japanese Yen", multiplier: 0.0067 },
  { code: "JOD", name: "Jordanian Dinar", multiplier: 1.41 },
  { code: "KRW", name: "South Korean Won", multiplier: 0.00075 },
  { code: "KWD", name: "Kuwaiti Dinar", multiplier: 3.26 },
  { code: "KZT", name: "Kazakhstani Tenge", multiplier: 0.002 },
  { code: "MDL", name: "Moldovan Leu", multiplier: 0.056 },
  { code: "MOP", name: "Macanese Pataca", multiplier: 0.12 },
  { code: "MXN", name: "Mexican Peso", multiplier: 0.050 },
  { code: "MYR", name: "Malaysian Ringgit", multiplier: 0.22 },
  { code: "NAD", name: "Namibian Dollar", multiplier: 0.056 },
  { code: "NOK", name: "Norwegian Krone", multiplier: 0.092 },
  { code: "NZD", name: "New Zealand Dollar", multiplier: 0.60 },
  { code: "OMR", name: "Omani Rial", multiplier: 2.60 },
  { code: "PLN", name: "Polish Złoty", multiplier: 0.25 },
  { code: "QAR", name: "Qatari Riyal", multiplier: 0.27 },
  { code: "RON", name: "Romanian Leu", multiplier: 0.21 },
  { code: "RUB", name: "Russian Rouble", multiplier: 0.011 },
  { code: "SAR", name: "Saudi Arabian Riyal", multiplier: 0.27 },
  { code: "SEK", name: "Swedish Krona", multiplier: 0.093 },
  { code: "SGD", name: "Singapore Dollar", multiplier: 0.74 },
  { code: "THB", name: "Thai Baht", multiplier: 0.029 },
  { code: "TRY", name: "Turkish Lira", multiplier: 0.029 },
  { code: "TWD", name: "New Taiwan Dollar", multiplier: 0.031 },
  { code: "UAH", name: "Ukrainian Hryvnia", multiplier: 0.024 },
  { code: "USD", name: "United States Dollar", multiplier: 1.0 },
  { code: "XOF", name: "West African CFA Franc", multiplier: 0.0016 },
  { code: "ZAR", name: "South African Rand", multiplier: 0.056 },
];
