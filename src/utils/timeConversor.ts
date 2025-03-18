import { TimeValue } from '@react-aria/datepicker';

export function convertStringToTimeValue(timeStr: string): TimeValue {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return { hour: hours, minute: minutes } as TimeValue;
}

export function convertTimeValueToString(time: TimeValue | null): string {
    if (!time) return '00:00';
    return `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;
}