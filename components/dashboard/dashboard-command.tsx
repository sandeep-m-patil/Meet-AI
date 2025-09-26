import { Dispatch, SetStateAction, useState } from "react";

import {
  CommandResponsiveDialog,
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashboardCommand = ({ open, setOpen }: Props) => {
  const [search, setSearch] = useState("");

  const staticItems = [
    { id: 1, label: "Dashboard" },
    { id: 2, label: "Settings" },
    { id: 3, label: "Profile" },
    { id: 4, label: "Support" },
  ];

  const filteredItems = staticItems.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <CommandResponsiveDialog shouldFilter={false} open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>
          <span className="text-muted-foreground text-sm">
            Nothing found
          </span>
        </CommandEmpty>
        <CommandGroup heading="Quick Access">
          {filteredItems.map((item) => (
            <CommandItem
              key={item.id}
              onSelect={() => {
                console.log(`Selected: ${item.label}`);
                setOpen(false);
              }}
            >
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandResponsiveDialog>
  );
};
