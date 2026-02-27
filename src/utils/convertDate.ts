export function convertISOToJalali(ISODate: Date) {
  return new Date(ISODate).toLocaleDateString("fa-IR");
}
