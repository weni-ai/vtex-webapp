import { DrawerContent } from "@vtex/shoreline";
import { TestContact } from "./TestContact";

export function PreferencesOrderStatusActive() {
  return (
    <DrawerContent>
      <TestContact code="order_status" />
    </DrawerContent>
  );
}