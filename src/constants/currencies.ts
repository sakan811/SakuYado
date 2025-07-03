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
}

export const CURRENCIES: Currency[] = [
  { code: "AED", name: "United Arab Emirates Dirham" },
  { code: "ARS", name: "Argentine Peso" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "AZN", name: "Azerbaijani Manat" },
  { code: "BHD", name: "Bahraini Dinar" },
  { code: "BGN", name: "Bulgarian Lev" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "CLP", name: "Chilean Peso" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "COP", name: "Colombian Peso" },
  { code: "CZK", name: "Czech Koruna" },
  { code: "DKK", name: "Danish Krone" },
  { code: "EGP", name: "Egyptian Pound" },
  { code: "EUR", name: "Euro" },
  { code: "FJD", name: "Fijian Dollar" },
  { code: "GBP", name: "Pound Sterling" },
  { code: "GEL", name: "Georgian Lari" },
  { code: "HKD", name: "Hong Kong Dollar" },
  { code: "HUF", name: "Hungarian Forint" },
  { code: "IDR", name: "Indonesian Rupiah" },
  { code: "ILS", name: "Israeli New Shekel" },
  { code: "INR", name: "Indian Rupee" },
  { code: "ISK", name: "Icelandic Króna" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "JOD", name: "Jordanian Dinar" },
  { code: "KRW", name: "South Korean Won" },
  { code: "KWD", name: "Kuwaiti Dinar" },
  { code: "KZT", name: "Kazakhstani Tenge" },
  { code: "MDL", name: "Moldovan Leu" },
  { code: "MOP", name: "Macanese Pataca" },
  { code: "MXN", name: "Mexican Peso" },
  { code: "MYR", name: "Malaysian Ringgit" },
  { code: "NAD", name: "Namibian Dollar" },
  { code: "NOK", name: "Norwegian Krone" },
  { code: "NZD", name: "New Zealand Dollar" },
  { code: "OMR", name: "Omani Rial" },
  { code: "PLN", name: "Polish Złoty" },
  { code: "QAR", name: "Qatari Riyal" },
  { code: "RON", name: "Romanian Leu" },
  { code: "RUB", name: "Russian Rouble" },
  { code: "SAR", name: "Saudi Arabian Riyal" },
  { code: "SEK", name: "Swedish Krona" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "THB", name: "Thai Baht" },
  { code: "TRY", name: "Turkish Lira" },
  { code: "TWD", name: "New Taiwan Dollar" },
  { code: "UAH", name: "Ukrainian Hryvnia" },
  { code: "USD", name: "United States Dollar" },
  { code: "XOF", name: "West African CFA Franc" },
  { code: "ZAR", name: "South African Rand" },
];
