export function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

export function cardBrand(number) {
  const digits = digitsOnly(number);
  if (/^4/.test(digits)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "American Express";
  if (/^(6011|65|64[4-9])/.test(digits)) return "Discover";
  return "Card";
}

export function formatCardNumber(value) {
  const raw = digitsOnly(value);
  const amex = /^3[47]/.test(raw);
  const digits = raw.slice(0, amex ? 15 : 16);
  if (amex) {
    return [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10, 15)].filter(Boolean).join(" ");
  }
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function formatExpiry(value, previous = "") {
  const deleting = digitsOnly(value).length < digitsOnly(previous).length;
  let digits = digitsOnly(value).slice(0, 4);
  if (!deleting && digits.length === 1 && Number(digits) > 1) digits = `0${digits}`;
  if (digits.length < 2) return digits;
  if (digits.length === 2) return deleting ? digits : `${digits}/`;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function luhnOk(digits) {
  let sum = 0;
  let alternate = false;
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);
    if (alternate) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

export function validatePayment(payment) {
  const cardName = payment.cardName.trim();
  const digits = digitsOnly(payment.number);
  const brand = cardBrand(digits);
  const amex = brand === "American Express";
  const expectedLength = amex ? 15 : 16;

  if (cardName.length < 2) return "Enter the name on the card.";
  if (digits.length !== expectedLength || !luhnOk(digits)) return "Enter a valid card number.";

  const expiry = /^(\d{2})\/(\d{2})$/.exec(payment.expiry);
  if (!expiry) return "Enter an expiry date as MM/YY.";
  const month = Number(expiry[1]);
  const year = 2000 + Number(expiry[2]);
  if (month < 1 || month > 12) return "Enter a month from 01 to 12.";
  const expires = new Date(year, month, 1);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (expires <= today) return "This card is expired.";

  const cvcLength = amex ? 4 : 3;
  if (digitsOnly(payment.cvc).length !== cvcLength) {
    return `Enter the ${cvcLength}-digit security code.`;
  }
  if (digitsOnly(payment.zip).length !== 5) return "Enter a 5-digit billing ZIP code.";
  return "";
}
