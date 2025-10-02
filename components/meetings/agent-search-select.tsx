"use client";

import { useState, useMemo } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { GeneratedAvatar } from "@/components/avatar/generated-avatar";
import Link from "next/link";
import type { AgentGetOne } from "@/modules/agents/types";

type Agent = NonNullable<AgentGetOne>;

interface AgentSearchSelectProps {
  agents: Agent[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export function AgentSearchSelect({
  agents,
  value,
  onValueChange,
  placeholder = "Select an agent",
  disabled = false,
  isLoading = false,
}: AgentSearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAgents = useMemo(() => {
    if (!searchQuery) return agents;
    return agents.filter((agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.instructions?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [agents, searchQuery]);

  const selectedAgent = agents.find((agent) => agent.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-[40px] px-3 py-2"
          disabled={disabled || isLoading}
        >
          {selectedAgent ? (
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <GeneratedAvatar
                variant="botttsNeutral"
                seed={selectedAgent.name}
                className="h-6 w-6 rounded-full border shrink-0"
              />
              <div className="flex flex-col items-start min-w-0 flex-1">
                <span className="font-medium text-sm truncate w-full text-left">
                  {selectedAgent.name}
                </span>
                {selectedAgent.instructions && (
                  <span className="text-xs text-muted-foreground truncate w-full text-left">
                    {selectedAgent.instructions}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground">
              {isLoading ? "Loading agents..." : placeholder}
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search agents..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0 focus:ring-0"
            />
          </div>
          <CommandList>
            <CommandEmpty>
              <div className="py-6 text-center text-sm">
                <p className="text-muted-foreground mb-2">No agents found.</p>
                <Link
                  href="/agents"
                  className="text-green-600 hover:underline text-sm"
                  onClick={() => setOpen(false)}
                >
                  Create new agent
                </Link>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {filteredAgents.map((agent) => (
                <CommandItem
                  key={agent.id}
                  value={agent.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    setSearchQuery("");
                  }}
                  className="flex items-center gap-3 p-3 cursor-pointer"
                >
                  <GeneratedAvatar
                    variant="botttsNeutral"
                    seed={agent.name}
                    className="h-8 w-8 rounded-full border shrink-0"
                  />
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-medium text-sm truncate">
                      {agent.name}
                    </span>
                    {agent.instructions && (
                      <span className="text-xs text-muted-foreground truncate">
                        {agent.instructions}
                      </span>
                    )}
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4 shrink-0",
                      value === agent.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
