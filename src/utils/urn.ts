interface ParsedUrn {
  channel: string;
  identifier: string;
}

function parseUrn(urn: string): ParsedUrn {
  const colonIndex = urn.indexOf(':');
  if (colonIndex === -1) {
    return { channel: '', identifier: urn };
  }
  return {
    channel: urn.substring(0, colonIndex),
    identifier: urn.substring(colonIndex + 1),
  };
}

function formatBrazilianPhone(digits: string): string {
  const areaCode = digits.substring(2, 4);
  const number = digits.substring(4);

  if (number.length === 9) {
    return `+55 (${areaCode}) ${number.substring(0, 5)}-${number.substring(5)}`;
  }

  return `+55 (${areaCode}) ${number.substring(0, 4)}-${number.substring(4)}`;
}

function formatPhoneNumber(digits: string): string {
  const isBrazilian = digits.startsWith('55') && (digits.length === 12 || digits.length === 13);
  if (isBrazilian) {
    return formatBrazilianPhone(digits);
  }
  return `+${digits}`;
}

export function formatUrn(urn: string): string {
  const { channel, identifier } = parseUrn(urn);

  if (channel === 'whatsapp') {
    return formatPhoneNumber(identifier);
  }

  return identifier;
}
